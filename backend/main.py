"""
FastAPI backend for the DataTalk AI prototype.
"""
from __future__ import annotations

import os
import sqlite3
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from typing import Any

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from database import (
    get_default_schema,
    get_schema_for_conn,
    get_session_conn,
    init_default_db,
    load_csv_session,
    run_query,
)
from gemini_client import ask_gemini
from query_engine import enrich_result_insight, fallback_query_plan

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_default_db()
    yield


app = FastAPI(title="DataTalk AI", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.mount("/static", StaticFiles(directory=FRONTEND_DIR), name="static")


class QueryRequest(BaseModel):
    prompt: str
    session_token: str | None = None
    history: list[dict[str, Any]] | None = None


def _get_schema(token: str | None) -> dict[str, Any]:
    if token:
        conn = get_session_conn(token)
        if conn:
            return get_schema_for_conn(conn, "uploaded_data")
    return get_default_schema()


def _sanitize_sql(sql: str, table: str) -> str:
    sql = sql.strip()
    if not sql.upper().startswith("SELECT"):
        raise ValueError("Only SELECT statements are allowed.")
    if table not in sql:
        raise ValueError(f"The generated SQL must query the allowed table: {table}.")
    return sql


@app.get("/")
async def index():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/api/health")
async def health():
    return {"status": "ok", "service": "DataTalk AI"}


@app.get("/api/schema")
async def schema(session_token: str | None = None):
    return _get_schema(session_token)


@app.post("/api/query")
async def query(req: QueryRequest) -> Any:
    schema = _get_schema(req.session_token)

    ai_plan = ask_gemini(req.prompt, schema, req.history)
    if "error" in ai_plan:
        ai_plan = fallback_query_plan(req.prompt, schema, req.history)

    if "error" in ai_plan:
        return {
            "error": ai_plan["error"],
            "suggestion": "Try rephrasing your question using region, month, profit, revenue, or category terms.",
        }

    sql = ai_plan.get("sql", "")
    charts = ai_plan.get("charts", [])
    insight = ai_plan.get("insight", "")

    try:
        table = "uploaded_data" if req.session_token and get_session_conn(req.session_token) else "sales_records"
        sql = _sanitize_sql(sql, table)
    except ValueError as error:
        return {"error": str(error)}

    try:
        rows = run_query(sql, req.session_token)
    except sqlite3.Error as error:
        return {
            "error": f"Database error: {error}",
            "sql": sql,
            "suggestion": "Try rephrasing the request or uploading a CSV with clearer columns.",
        }

    if not rows:
        return {
            "error": "No data found for your query.",
            "sql": sql,
            "suggestion": "Try broader filters or remove the time restriction.",
        }

    return {
        "sql": sql,
        "charts": charts,
        "data": rows,
        "insight": enrich_result_insight({"insight": insight}, rows),
        "row_count": len(rows),
    }


@app.post("/api/upload")
async def upload_csv(file: UploadFile = File(...)):
    if not file.filename or not file.filename.endswith(".csv"):
        raise HTTPException(status_code=400, detail="Only CSV files are accepted.")

    csv_bytes = await file.read()
    token = str(uuid.uuid4())

    try:
        schema = load_csv_session(token, csv_bytes)
    except Exception as error:
        raise HTTPException(status_code=400, detail=f"Could not parse CSV: {error}") from error

    return {
        "session_token": token,
        "filename": file.filename,
        "schema": schema,
        "message": f"Loaded {file.filename}. You can now query your uploaded data.",
    }
