from django.urls import path
from apps.fuel_route.views import RoutePlannerView, FuelStationListView, HealthCheckView

urlpatterns = [
    path("route/",    RoutePlannerView.as_view(),    name="route-planner"),
    path("stations/", FuelStationListView.as_view(), name="station-list"),
    path("health/",   HealthCheckView.as_view(),     name="health-check"),
]
