import pandas as pd
from django.conf import settings
from django.core.management.base import BaseCommand, CommandError
from apps.fuel_route.models import FuelStation


class Command(BaseCommand):
    help = "Load fuel station data from CSV into the database."

    def add_arguments(self, parser):
        parser.add_argument("--csv", type=str, default=str(settings.FUEL_CSV_PATH))

    def handle(self, *args, **options):
        path = options["csv"]
        self.stdout.write(f"Loading: {path}")
        try:
            df = pd.read_csv(path).dropna(
                subset=["name", "city", "state", "lat", "lon", "price_per_gallon"])
        except FileNotFoundError:
            raise CommandError(f"CSV not found: {path}")

        deleted, _ = FuelStation.objects.all().delete()
        self.stdout.write(f"  Cleared {deleted} existing record(s).")

        FuelStation.objects.bulk_create([
            FuelStation(
                name=str(r["name"]).strip(),
                city=str(r["city"]).strip(),
                state=str(r["state"]).strip().upper(),
                lat=float(r["lat"]),
                lon=float(r["lon"]),
                price_per_gallon=round(float(r["price_per_gallon"]), 3),
            ) for _, r in df.iterrows()
        ], batch_size=500)

        self.stdout.write(self.style.SUCCESS(f"  Loaded {len(df)} station(s)."))
