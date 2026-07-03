from django.db import models


class FuelStation(models.Model):
    name             = models.CharField(max_length=200, db_index=True)
    city             = models.CharField(max_length=100)
    state            = models.CharField(max_length=2, db_index=True)
    lat              = models.FloatField()
    lon              = models.FloatField()
    price_per_gallon = models.DecimalField(max_digits=5, decimal_places=3)

    class Meta:
        indexes = [
            models.Index(fields=["lat", "lon"]),
            models.Index(fields=["price_per_gallon"]),
        ]
        ordering = ["price_per_gallon"]

    def __str__(self):
        return f"{self.name} — {self.city}, {self.state} (${self.price_per_gallon}/gal)"
