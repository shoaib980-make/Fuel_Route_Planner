import math
import logging
from django.conf import settings
from apps.fuel_route.models import FuelStation

logger = logging.getLogger(__name__)


def haversine_miles(lat1, lon1, lat2, lon2) -> float:
    R = 3958.8
    rl1, rl2 = math.radians(lat1), math.radians(lat2)
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2)**2 + math.cos(rl1)*math.cos(rl2)*math.sin(dlon/2)**2
    return R * 2 * math.asin(math.sqrt(a))


def _cheapest_near(lat, lon, radius) -> FuelStation | None:
    """Bounding-box pre-filter then precise haversine check, cheapest first."""
    lat_m = radius / 69.0
    lon_m = radius / (69.0 * math.cos(math.radians(lat)) + 1e-6)

    for station in FuelStation.objects.filter(
        lat__gte=lat - lat_m, lat__lte=lat + lat_m,
        lon__gte=lon - lon_m, lon__lte=lon + lon_m,
    ).order_by("price_per_gallon"):
        if haversine_miles(lat, lon, station.lat, station.lon) <= radius:
            return station
    return None


def find_optimal_fuel_stops(coords: list, total_miles: float) -> list[dict]:
    threshold = settings.FUEL_STOP_THRESHOLD_MILES   # 450
    radius    = settings.NEARBY_STATION_RADIUS_MILES  # 75
    mpg       = settings.VEHICLE_MPG                  # 10

    stops:          list[dict] = []
    miles_since:    float      = 0.0
    total_so_far:   float      = 0.0

    for i in range(1, len(coords)):
        plon, plat = coords[i - 1]
        clon, clat = coords[i]
        seg          = haversine_miles(plat, plon, clat, clon)
        miles_since  += seg
        total_so_far += seg

        if miles_since < threshold:
            continue

        station = _cheapest_near(clat, clon, radius) or _cheapest_near(clat, clon, 150)
        if not station:
            logger.error("No station found near (%.2f, %.2f)", clat, clon)
            continue

        gallons = miles_since / mpg
        stops.append({
            "stop_number":       len(stops) + 1,
            "station":           station,
            "miles_from_start":  round(total_so_far, 1),
            "gallons_needed":    round(gallons, 2),
            "cost_at_this_stop": round(gallons * float(station.price_per_gallon), 2),
        })
        miles_since = 0.0

    # Remaining miles after last stop
    if miles_since > 0:
        if stops:
            last    = stops[-1]
            extra_g = miles_since / mpg
            extra_c = extra_g * float(last["station"].price_per_gallon)
            last["gallons_needed"]    = round(last["gallons_needed"]    + extra_g, 2)
            last["cost_at_this_stop"] = round(last["cost_at_this_stop"] + extra_c, 2)
        else:
            mlon, mlat = coords[len(coords) // 2]
            station = _cheapest_near(mlat, mlon, 200)
            if station:
                gallons = total_miles / mpg
                stops.append({
                    "stop_number":       1,
                    "station":           station,
                    "miles_from_start":  round(total_miles / 2, 1),
                    "gallons_needed":    round(gallons, 2),
                    "cost_at_this_stop": round(gallons * float(station.price_per_gallon), 2),
                })

    logger.info("Optimizer: %d stop(s) for %.1f mile route", len(stops), total_miles)
    return stops
