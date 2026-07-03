import hashlib
import logging

from django.conf import settings
from django.core.cache import cache
from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from apps.fuel_route.models import FuelStation
from apps.fuel_route.serializers import RouteRequestSerializer
from apps.fuel_route.services.routing import geocode_location, get_route
from apps.fuel_route.services.optimizer import find_optimal_fuel_stops
from apps.fuel_route.services.cost import calculate_total_cost

logger = logging.getLogger(__name__)


def _cache_key(start: str, finish: str) -> str:
    raw = f"{start.lower().strip()}|{finish.lower().strip()}"
    return "route_" + hashlib.md5(raw.encode()).hexdigest()


class RoutePlannerView(APIView):
    """POST /api/route/ — plan a fuel-optimised route."""

    def post(self, request):
        serializer = RouteRequestSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": "Invalid input", "details": serializer.errors},
                            status=status.HTTP_400_BAD_REQUEST)

        start  = serializer.validated_data["start"]
        finish = serializer.validated_data["finish"]

        key    = _cache_key(start, finish)
        cached = cache.get(key)
        if cached:
            cached["cached"] = True
            return Response(cached)

        try:
            start_lat, start_lon = geocode_location(start)
            end_lat,   end_lon   = geocode_location(finish)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)

        try:
            route = get_route(start_lat, start_lon, end_lat, end_lon)
        except ValueError as e:
            return Response({"error": str(e)}, status=status.HTTP_502_BAD_GATEWAY)

        fuel_stops = find_optimal_fuel_stops(route["coordinates"], route["distance_miles"])

        if not fuel_stops:
            return Response({"error": "No fuel stations found. Run: python manage.py load_fuel_data"},
                            status=status.HTTP_404_NOT_FOUND)

        total_gallons, total_cost = calculate_total_cost(route["distance_miles"], fuel_stops)

        payload = {
            "start":                start,
            "finish":               finish,
            "total_distance_miles": round(route["distance_miles"], 2),
            "total_gallons_used":   round(total_gallons, 2),
            "total_fuel_cost_usd":  round(total_cost, 2),
            "vehicle_mpg":          settings.VEHICLE_MPG,
            "fuel_stops": [{
                "stop_number":       s["stop_number"],
                "station_name":      s["station"].name,
                "city":              s["station"].city,
                "state":             s["station"].state,
                "lat":               s["station"].lat,
                "lon":               s["station"].lon,
                "price_per_gallon":  float(s["station"].price_per_gallon),
                "miles_from_start":  s["miles_from_start"],
                "gallons_needed":    s["gallons_needed"],
                "cost_at_this_stop": s["cost_at_this_stop"],
            } for s in fuel_stops],
            "route_geojson": route["geojson"],
            "cached": False,
        }

        cache.set(key, payload, timeout=settings.ROUTE_CACHE_TIMEOUT)
        return Response(payload, status=status.HTTP_200_OK)


class FuelStationListView(APIView):
    """GET /api/stations/ — list all stations."""

    def get(self, request):
        stations = list(FuelStation.objects.values(
            "id", "name", "city", "state", "lat", "lon", "price_per_gallon"))
        return Response({"count": len(stations), "stations": stations})


class HealthCheckView(APIView):
    """GET /api/health/ — health check."""

    def get(self, request):
        return Response({
            "status": "ok",
            "stations_loaded": FuelStation.objects.count(),
            "message": "FuelRoutePlanner API is running.",
        })
