from django.db import migrations, models


class Migration(migrations.Migration):
    initial = True
    dependencies = []
    operations = [
        migrations.CreateModel(
            name="FuelStation",
            fields=[
                ("id",              models.BigAutoField(auto_created=True, primary_key=True, serialize=False)),
                ("name",            models.CharField(db_index=True, max_length=200)),
                ("city",            models.CharField(max_length=100)),
                ("state",           models.CharField(db_index=True, max_length=2)),
                ("lat",             models.FloatField()),
                ("lon",             models.FloatField()),
                ("price_per_gallon", models.DecimalField(decimal_places=3, max_digits=5)),
            ],
            options={"ordering": ["price_per_gallon"]},
        ),
        migrations.AddIndex(model_name="fuelstation",
            index=models.Index(fields=["lat", "lon"], name="fuel_lat_lon_idx")),
        migrations.AddIndex(model_name="fuelstation",
            index=models.Index(fields=["price_per_gallon"], name="fuel_price_idx")),
    ]
