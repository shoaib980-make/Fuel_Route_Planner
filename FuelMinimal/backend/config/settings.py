import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent.parent / ".env")

BASE_DIR   = Path(__file__).resolve().parent.parent
SECRET_KEY = os.getenv("SECRET_KEY", "django-insecure-change-me")
DEBUG      = os.getenv("DEBUG", "True") == "True"
ALLOWED_HOSTS = os.getenv("ALLOWED_HOSTS", "localhost,127.0.0.1").split(",")

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "corsheaders",
    "apps.fuel_route",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF   = "config.urls"
WSGI_APPLICATION = "config.wsgi.application"

TEMPLATES = [{
    "BACKEND": "django.template.backends.django.DjangoTemplates",
    "DIRS": [],
    "APP_DIRS": True,
    "OPTIONS": {"context_processors": [
        "django.template.context_processors.debug",
        "django.template.context_processors.request",
        "django.contrib.auth.context_processors.auth",
        "django.contrib.messages.context_processors.messages",
    ]},
}]

DATABASES = {"default": {
    "ENGINE":   "django.db.backends.postgresql",
    "NAME":     os.getenv("DB_NAME",     "fuelroute_db"),
    "USER":     os.getenv("DB_USER",     "postgres"),
    "PASSWORD": os.getenv("DB_PASSWORD", "postgres"),
    "HOST":     os.getenv("DB_HOST",     "localhost"),
    "PORT":     os.getenv("DB_PORT",     "5432"),
}}

CACHES = {"default": {
    "BACKEND":  "django.core.cache.backends.locmem.LocMemCache",
    "LOCATION": "fuel-route-cache",
}}

REST_FRAMEWORK = {
    "DEFAULT_RENDERER_CLASSES": ["rest_framework.renderers.JSONRenderer"],
    "DEFAULT_PARSER_CLASSES":   ["rest_framework.parsers.JSONParser"],
    "DEFAULT_THROTTLE_CLASSES": ["rest_framework.throttling.AnonRateThrottle"],
    "DEFAULT_THROTTLE_RATES":   {"anon": "30/minute"},
}

CORS_ALLOWED_ORIGINS = [
    os.getenv("FRONTEND_URL", "http://localhost:5173"),
    "http://localhost:3000",
]

STATIC_URL  = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

LANGUAGE_CODE = "en-us"
TIME_ZONE     = "UTC"
USE_I18N = USE_TZ = True

# App-specific
ORS_API_KEY                 = os.getenv("ORS_API_KEY", "")
VEHICLE_MAX_RANGE_MILES     = 500
VEHICLE_MPG                 = 10
FUEL_STOP_THRESHOLD_MILES   = 450
NEARBY_STATION_RADIUS_MILES = 75
ROUTE_CACHE_TIMEOUT         = int(os.getenv("ROUTE_CACHE_TIMEOUT", "3600"))
FUEL_CSV_PATH               = BASE_DIR / "fuel_prices.csv"
