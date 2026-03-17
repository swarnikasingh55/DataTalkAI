"""
Gemini-powered prompt -> SQL helper with graceful fallback signaling.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path
from typing import Any

import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv(Path(__file__).resolve().with_name(".env"))

API_KEY = os.environ.get("GEMINI_API_KEY", "")
genai.configure(api_key=API_KEY)

MODEL = "gemini-1.5-flash"

SYSTEM_PROMPT = """You are DataTalk AI, an expert business intelligence assistant.
You convert natural language business questions into valid SQLite SQL and chart suggestions.

Return valid JSON only:
{
  "sql": "SELECT ...",
  "charts": [
    {
      "type": "bar",
      "title": "Revenue by Region",
      "x": "region",
      "y": "total_value",
      "color": "#2563eb"
    }
  ],
  "insight": "One concise business insight."
}

Rules:
- Use only columns present in the schema.
- Query only the provided table.
- Return SELECT statements only.
- Use aliases like total_value for aggregates.
- Use line charts for time series, pie for shares, and bar for category comparisons.
- If the question cannot be answered, return:
  {"error": "I cannot answer this from the available data. Reason: <brief explanation>"}
"""


def build_schema_context(schema: dict[str, Any]) -> str:
    lines = [f"Table: {schema['table']}", "Columns:"]
    for col in schema["columns"]:
        samples = schema["samples"].get(col, [])
        sample_str = ", ".join(str(sample) for sample in samples[:5])
        lines.append(f"  - {col} (e.g. {sample_str})")
    return "\n".join(lines)


def ask_gemini(
    prompt: str,
    schema: dict[str, Any],
    history: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    if not API_KEY:
        return {"error": "Gemini API key is not configured."}

    model = genai.GenerativeModel(model_name=MODEL, system_instruction=SYSTEM_PROMPT)
    schema_ctx = build_schema_context(schema)
    full_prompt = f"""## Database Schema
{schema_ctx}

## Conversation History
{_format_history(history or [])}

## User Question
{prompt}

Respond with valid JSON only."""

    raw = ""
    try:
        response = model.generate_content(full_prompt)
        raw = response.text.strip()
        raw = re.sub(r"^```[a-z]*\n?", "", raw)
        raw = re.sub(r"\n?```$", "", raw)
        return json.loads(raw)
    except json.JSONDecodeError as error:
        return {"error": f"Could not parse AI response as JSON: {error}. Raw: {raw[:300]}"}
    except Exception as error:
        return {"error": f"Gemini API error: {error}"}


def _format_history(history: list[dict[str, Any]]) -> str:
    if not history:
        return "(none)"

    lines: list[str] = []
    for item in history[-4:]:
        lines.append(f"User: {item.get('user', '')}")
        lines.append(f"Assistant SQL: {item.get('sql', '')}")
    return "\n".join(lines)
