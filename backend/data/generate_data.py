"""
Generate a synthetic customer behavior dataset based on the provided data dictionary.
"""
from __future__ import annotations

import csv
import random
from pathlib import Path

random.seed(42)

GENDERS = ["Male", "Female", "Other"]
CITY_TIERS = ["Tier 1", "Tier 2", "Tier 3"]


def rand_score(low: int = 1, high: int = 10) -> int:
    return random.randint(low, high)


def generate_sales_dataset(output_path: str | Path, row_count: int = 1000) -> Path:
    output = Path(output_path)
    output.parent.mkdir(parents=True, exist_ok=True)

    rows: list[dict[str, object]] = []
    for customer_id in range(1, row_count + 1):
        age = random.randint(18, 70)
        monthly_income = random.randint(20000, 300000)
        daily_internet_hours = round(random.uniform(0.5, 12.0), 1)
        smartphone_usage_years = random.randint(1, 15)
        social_media_hours = round(random.uniform(0.2, 6.0), 1)
        online_payment_trust_score = rand_score()
        tech_savvy_score = rand_score()
        monthly_online_orders = random.randint(0, 30)
        monthly_store_visits = random.randint(0, 20)
        avg_online_spend = random.randint(500, 150000)
        avg_store_spend = random.randint(500, 150000)
        discount_sensitivity = rand_score()
        return_frequency = rand_score()
        avg_delivery_days = random.randint(1, 10)
        delivery_fee_sensitivity = rand_score()
        free_return_importance = rand_score()
        product_availability_online = rand_score()
        impulse_buying_score = rand_score()
        need_touch_feel_score = rand_score()
        brand_loyalty_score = rand_score()
        environmental_awareness = rand_score()
        time_pressure_level = rand_score()
        gender = random.choice(GENDERS)
        city_tier = random.choice(CITY_TIERS)

        if monthly_store_visits > 12 and monthly_online_orders < 6:
            shopping_preference = "Store"
        elif monthly_online_orders > 15 and monthly_store_visits < 6:
            shopping_preference = "Online"
        else:
            shopping_preference = "Hybrid"

        rows.append(
            {
                "customer_id": customer_id,
                "age": age,
                "monthly_income": monthly_income,
                "daily_internet_hours": daily_internet_hours,
                "smartphone_usage_years": smartphone_usage_years,
                "social_media_hours": social_media_hours,
                "online_payment_trust_score": online_payment_trust_score,
                "tech_savvy_score": tech_savvy_score,
                "monthly_online_orders": monthly_online_orders,
                "monthly_store_visits": monthly_store_visits,
                "avg_online_spend": avg_online_spend,
                "avg_store_spend": avg_store_spend,
                "discount_sensitivity": discount_sensitivity,
                "return_frequency": return_frequency,
                "avg_delivery_days": avg_delivery_days,
                "delivery_fee_sensitivity": delivery_fee_sensitivity,
                "free_return_importance": free_return_importance,
                "product_availability_online": product_availability_online,
                "impulse_buying_score": impulse_buying_score,
                "need_touch_feel_score": need_touch_feel_score,
                "brand_loyalty_score": brand_loyalty_score,
                "environmental_awareness": environmental_awareness,
                "time_pressure_level": time_pressure_level,
                "gender": gender,
                "city_tier": city_tier,
                "shopping_preference": shopping_preference,
            }
        )

    with output.open("w", newline="", encoding="utf-8") as csv_file:
        writer = csv.DictWriter(csv_file, fieldnames=list(rows[0].keys()))
        writer.writeheader()
        writer.writerows(rows)

    return output


if __name__ == "__main__":
    target = Path(__file__).resolve().parent / "sales_data.csv"
    path = generate_sales_dataset(target)
    print(f"Generated {path.name} with synthetic customer behavior records.")
