import logging
import requests
from django.conf import settings

logger = logging.getLogger(__name__)

ORS_BASE       = "https://api.openrouteservice.org"
GEOCODE_URL    = f"{ORS_BASE}/geocode/search"
DIRECTIONS_URL = f"{ORS_BASE}/v2/directions/driving-car/geojson"
METERS_TO_MILES = 0.000621371


def _key():
    k = settings.ORS_API_KEY
    if not k:
        raise ValueError(
            "ORS_API_KEY is missing. Get a free key at "
            "https://openrouteservice.org/dev/#/signup and add it to .env"
        )
    return k


def geocode_location(name: str) -> tuple[float, float]:
    """Convert a place name to (lat, lon)."""
    try:
        r = requests.get(GEOCODE_URL, params={
            "api_key": _key(), "text": name,
            "boundary.country": "US", "size": 1,
        }, timeout=15)
        r.raise_for_status()
        features = r.json().get("features", [])
    except requests.RequestException as e:
        raise ValueError(f"Geocoding failed for '{name}': {e}") from e

    if not features:
        raise ValueError(f"Location not found: '{name}'. Use 'City, STATE' format e.g. 'Dallas, TX'")

    lon, lat = features[0]["geometry"]["coordinates"]
    logger.info("Geocoded '%s' → (%.4f, %.4f)", name, lat, lon)
    return lat, lon


def get_route(slat, slon, elat, elon) -> dict:
    """Fetch driving route from ORS. Returns distance_miles, coordinates, geojson."""
    try:
        r = requests.post(DIRECTIONS_URL,
            json={"coordinates": [[slon, slat], [elon, elat]]},
            headers={"Authorization": _key(), "Content-Type": "application/json"},
            timeout=30)
        r.raise_for_status()
        features = r.json().get("features", [])
    except requests.RequestException as e:
        raise ValueError(f"Routing failed: {e}") from e

    if not features:
        raise ValueError("ORS returned no route. Check both locations are within the USA.")

    feature = features[0]
    distance_miles = feature["properties"]["segments"][0]["distance"] * METERS_TO_MILES

    logger.info("Route: %.1f miles, %d points", distance_miles, len(feature["geometry"]["coordinates"]))
    return {
        "distance_miles": round(distance_miles, 2),
        "coordinates":    feature["geometry"]["coordinates"],
        "geojson":        {"type": "FeatureCollection", "features": [feature]},
    }
