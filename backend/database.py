"""
SQLite helpers for DataTalk AI.
"""
from __future__ import annotations

import csv
import io
import os
import sqlite3
from typing import Any

from data.generate_data import generate_sales_dataset

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")
DEFAULT_DB = os.path.join(DATA_DIR, "datatalk_ai.db")
DEFAULT_CSV = os.path.join(DATA_DIR, "sales_data.csv")

_sessions: dict[str, sqlite3.Connection] = {}
EXPECTED_DEFAULT_COLUMNS = {
    "customer_id",
    "age",
    "monthly_income",
    "daily_internet_hours",
    "smartphone_usage_years",
    "social_media_hours",
    "online_payment_trust_score",
    "tech_savvy_score",
    "monthly_online_orders",
    "monthly_store_visits",
    "avg_online_spend",
    "avg_store_spend",
    "discount_sensitivity",
    "return_frequency",
    "avg_delivery_days",
    "delivery_fee_sensitivity",
    "free_return_importance",
    "product_availability_online",
    "impulse_buying_score",
    "need_touch_feel_score",
    "brand_loyalty_score",
    "environmental_awareness",
    "time_pressure_level",
    "gender",
    "city_tier",
    "shopping_preference",
}


def init_default_db() -> None:
    os.makedirs(DATA_DIR, exist_ok=True)
    if not os.path.exists(DEFAULT_CSV) or not _default_csv_matches_schema(DEFAULT_CSV):
        generate_sales_dataset(DEFAULT_CSV)

    rows = _read_csv_file(DEFAULT_CSV)
    if not rows:
        raise FileNotFoundError(f"No rows found in dataset CSV: {DEFAULT_CSV}")

    conn = sqlite3.connect(DEFAULT_DB)
    _load_rows_into_table(conn, "sales_records", rows)
    conn.close()
    print(f"Loaded {len(rows)} rows into sales_records.")


def load_csv_session(token: str, csv_bytes: bytes) -> dict[str, Any]:
    rows = _read_csv_bytes(csv_bytes)
    if not rows:
        raise ValueError("The uploaded CSV did not contain any rows.")

    conn = sqlite3.connect(":memory:", check_same_thread=False)
    _load_rows_into_table(conn, "uploaded_data", rows)
    _sessions[token] = conn
    return get_schema_for_conn(conn, "uploaded_data")


def get_session_conn(token: str) -> sqlite3.Connection | None:
    return _sessions.get(token)


def get_default_schema() -> dict[str, Any]:
    conn = sqlite3.connect(DEFAULT_DB)
    schema = get_schema_for_conn(conn, "sales_records")
    conn.close()
    return schema


def get_schema_for_conn(conn: sqlite3.Connection, table: str) -> dict[str, Any]:
    cursor = conn.cursor()
    cursor.execute(f"PRAGMA table_info({table})")
    cols = [row[1] for row in cursor.fetchall()]
    samples: dict[str, list[Any]] = {}
    for col in cols:
        try:
            cursor.execute(f'SELECT DISTINCT "{col}" FROM {table} LIMIT 6')
            samples[col] = [row[0] for row in cursor.fetchall()]
        except sqlite3.Error:
            samples[col] = []
    return {"table": table, "columns": cols, "samples": samples}


def run_query(sql: str, token: str | None = None) -> list[dict[str, Any]]:
    if token and token in _sessions:
        return _execute(_sessions[token], sql)

    conn = sqlite3.connect(DEFAULT_DB)
    try:
        return _execute(conn, sql)
    finally:
        conn.close()


def _execute(conn: sqlite3.Connection, sql: str) -> list[dict[str, Any]]:
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute(sql)
    rows = cur.fetchall()
    return [dict(row) for row in rows]


def _read_csv_file(path: str) -> list[dict[str, Any]]:
    with open(path, "r", encoding="utf-8", newline="") as handle:
        reader = csv.DictReader(handle)
        return [_normalize_row(row) for row in reader]


def _default_csv_matches_schema(path: str) -> bool:
    try:
        with open(path, "r", encoding="utf-8", newline="") as handle:
            reader = csv.reader(handle)
            header = next(reader, [])
    except OSError:
        return False

    normalized_header = {_normalize_column_name(column) for column in header}
    return EXPECTED_DEFAULT_COLUMNS.issubset(normalized_header)


def _read_csv_bytes(csv_bytes: bytes) -> list[dict[str, Any]]:
    text_stream = io.StringIO(csv_bytes.decode("utf-8-sig"))
    reader = csv.DictReader(text_stream)
    return [_normalize_row(row) for row in reader]


def _normalize_row(row: dict[str, Any]) -> dict[str, Any]:
    normalized: dict[str, Any] = {}
    for key, value in row.items():
        normalized[_normalize_column_name(key)] = _coerce_value(value)
    return normalized


def _normalize_column_name(value: str) -> str:
    return value.strip().lower().replace(" ", "_").replace("-", "_")


def _coerce_value(value: Any) -> Any:
    if value is None:
        return None

    text = str(value).strip()
    if text == "":
        return None

    for caster in (int, float):
        try:
            return caster(text)
        except ValueError:
            continue
    return text


def _load_rows_into_table(conn: sqlite3.Connection, table: str, rows: list[dict[str, Any]]) -> None:
    columns = list(rows[0].keys())
    column_defs = ", ".join(f'"{column}" {_infer_sqlite_type(rows, column)}' for column in columns)
    conn.execute(f'DROP TABLE IF EXISTS "{table}"')
    conn.execute(f'CREATE TABLE "{table}" ({column_defs})')

    placeholders = ", ".join("?" for _ in columns)
    quoted_columns = ", ".join(f'"{column}"' for column in columns)
    insert_sql = (
        f'INSERT INTO "{table}" ({quoted_columns}) '
        f"VALUES ({placeholders})"
    )
    conn.executemany(insert_sql, ([row.get(column) for column in columns] for row in rows))
    conn.commit()


def _infer_sqlite_type(rows: list[dict[str, Any]], column: str) -> str:
    sample_values = [row.get(column) for row in rows[:30] if row.get(column) is not None]
    if sample_values and all(isinstance(value, int) for value in sample_values):
        return "INTEGER"
    if sample_values and all(isinstance(value, (int, float)) for value in sample_values):
        return "REAL"
    return "TEXT"
