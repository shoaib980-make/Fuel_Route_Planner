from django.conf import settings


def calculate_total_cost(total_miles: float, stops: list[dict]) -> tuple[float, float]:
    """Returns (total_gallons, total_cost_usd)."""
    total_gallons = total_miles / settings.VEHICLE_MPG
    total_cost    = sum(s["cost_at_this_stop"] for s in stops)
    return round(total_gallons, 2), round(total_cost, 2)
