"""
Rule-based fallback engine for prompt -> SQL -> charts for the customer behavior dataset.
"""
from __future__ import annotations

from typing import Any


def fallback_query_plan(
    prompt: str,
    schema: dict[str, Any],
    history: list[dict[str, Any]] | None = None,
) -> dict[str, Any]:
    prompt_l = prompt.lower()
    table = schema["table"]

    metric, metric_label = _detect_metric(prompt_l)
    breakdown = _detect_breakdown(prompt_l)
    filters = _detect_filters(prompt_l)

    if "correlation" in prompt_l or "relationship" in prompt_l:
        x_field = "tech_savvy_score" if "tech" in prompt_l else "daily_internet_hours"
        y_field = "avg_online_spend" if "online" in prompt_l else metric
        sql = (
            f"SELECT {x_field}, {y_field}, shopping_preference "
            f"FROM {table} {_where_clause(filters)} LIMIT 120"
        )
        return {
            "sql": sql,
            "charts": [
                {
                    "type": "scatter",
                    "title": f"{humanize(y_field)} vs {humanize(x_field)}",
                    "x": x_field,
                    "y": y_field,
                    "series": "shopping_preference",
                    "color": "#2563eb",
                }
            ],
            "insight": "This view helps compare behavioral signals across shopping preferences.",
        }

    if "top" in prompt_l and ("segment" in prompt_l or "preference" in prompt_l):
        group_field = breakdown or "shopping_preference"
        sql = (
            f"SELECT {group_field}, ROUND(AVG({metric}), 2) AS avg_value "
            f"FROM {table} {_where_clause(filters)} "
            f"GROUP BY {group_field} ORDER BY avg_value DESC LIMIT 5"
        )
        return {
            "sql": sql,
            "charts": [
                {
                    "type": "bar",
                    "title": f"Top {humanize(group_field)} by {metric_label}",
                    "x": group_field,
                    "y": "avg_value",
                    "color": "#0f766e",
                }
            ],
            "insight": f"This ranks segments by average {metric_label.lower()}.",
        }

    if "share" in prompt_l or "distribution" in prompt_l or "breakdown" in prompt_l:
        group_field = breakdown or "shopping_preference"
        sql = (
            f"SELECT {group_field}, COUNT(*) AS customer_count "
            f"FROM {table} {_where_clause(filters)} "
            f"GROUP BY {group_field} ORDER BY customer_count DESC LIMIT 8"
        )
        return {
            "sql": sql,
            "charts": [
                {
                    "type": "pie",
                    "title": f"Customer Distribution by {humanize(group_field)}",
                    "x": group_field,
                    "y": "customer_count",
                    "color": "#d97706",
                }
            ],
            "insight": f"This shows how customers are distributed across {humanize(group_field).lower()}.",
        }

    if breakdown:
        sql = (
            f"SELECT {breakdown}, ROUND(AVG({metric}), 2) AS avg_value "
            f"FROM {table} {_where_clause(filters)} "
            f"GROUP BY {breakdown} ORDER BY avg_value DESC LIMIT 10"
        )
        return {
            "sql": sql,
            "charts": [
                {
                    "type": "bar",
                    "title": f"Average {metric_label} by {humanize(breakdown)}",
                    "x": breakdown,
                    "y": "avg_value",
                    "color": "#2563eb",
                }
            ],
            "insight": f"This compares average {metric_label.lower()} across {humanize(breakdown).lower()}.",
        }

    sql = (
        f"SELECT shopping_preference, ROUND(AVG({metric}), 2) AS avg_value "
        f"FROM {table} {_where_clause(filters)} "
        "GROUP BY shopping_preference ORDER BY avg_value DESC"
    )
    return {
        "sql": sql,
        "charts": [
            {
                "type": "bar",
                "title": f"Average {metric_label} by Shopping Preference",
                "x": "shopping_preference",
                "y": "avg_value",
                "color": "#2563eb",
            },
            {
                "type": "table",
                "title": "Detailed Results",
                "x": "shopping_preference",
                "y": "avg_value",
            },
        ],
        "insight": f"This compares average {metric_label.lower()} across shopping preferences.",
    }


def enrich_result_insight(plan: dict[str, Any], rows: list[dict[str, Any]]) -> str:
    if not rows:
        return plan.get("insight", "")

    numeric_keys = [key for key in rows[0].keys() if isinstance(rows[0][key], (int, float))]
    if not numeric_keys:
        return plan.get("insight", "")

    measure = numeric_keys[-1]
    best_row = max(rows, key=lambda row: row.get(measure, 0))
    dimension_keys = [key for key in rows[0].keys() if key != measure]
    lead_label = ", ".join(
        str(best_row.get(key)) for key in dimension_keys[:2] if best_row.get(key) is not None
    )
    lead_value = best_row.get(measure, 0)

    return (
        f"{plan.get('insight', '').rstrip('.')} "
        f"Highest result: {lead_label} at {lead_value:,.2f}."
    ).strip()


def _detect_metric(prompt_l: str) -> tuple[str, str]:
    metric_map = [
        ("online spend", ("avg_online_spend", "Online Spend")),
        ("store spend", ("avg_store_spend", "Store Spend")),
        ("income", ("monthly_income", "Monthly Income")),
        ("internet", ("daily_internet_hours", "Internet Hours")),
        ("social media", ("social_media_hours", "Social Media Hours")),
        ("online orders", ("monthly_online_orders", "Online Orders")),
        ("store visits", ("monthly_store_visits", "Store Visits")),
        ("tech savvy", ("tech_savvy_score", "Tech Savvy Score")),
        ("trust", ("online_payment_trust_score", "Online Payment Trust Score")),
        ("discount", ("discount_sensitivity", "Discount Sensitivity")),
        ("delivery", ("avg_delivery_days", "Delivery Days")),
        ("loyalty", ("brand_loyalty_score", "Brand Loyalty Score")),
        ("impulse", ("impulse_buying_score", "Impulse Buying Score")),
    ]
    for label, mapping in metric_map:
        if label in prompt_l:
            return mapping
    return "avg_online_spend", "Online Spend"


def _detect_breakdown(prompt_l: str) -> str | None:
    mapping = {
        "shopping preference": "shopping_preference",
        "preference": "shopping_preference",
        "gender": "gender",
        "city tier": "city_tier",
        "age": "age",
        "income": "monthly_income",
    }
    for label, field in mapping.items():
        if label in prompt_l:
            return field
    return None


def _detect_filters(prompt_l: str) -> list[str]:
    filters: list[str] = []

    for preference in ("online", "store", "hybrid"):
        if f"only {preference}" in prompt_l or f"{preference} customers" in prompt_l:
            filters.append(f"shopping_preference = '{preference.title()}'")

    for tier in ("tier 1", "tier 2", "tier 3"):
        if tier in prompt_l:
            filters.append(f"city_tier = '{tier.title()}'")

    for gender in ("male", "female", "other"):
        if f" {gender}" in f" {prompt_l}":
            filters.append(f"gender = '{gender.title()}'")

    return filters


def _where_clause(filters: list[str]) -> str:
    if not filters:
        return ""
    return f"WHERE {' AND '.join(filters)}"


def humanize(value: str) -> str:
    return value.replace("_", " ").title()
