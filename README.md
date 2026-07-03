# ⛽ FuelRoute Planner

> A production-quality full-stack web application that plans fuel-efficient road trips across the USA — automatically finding the **cheapest gas stations** along your route.

---

## 📸 What It Does

- Enter any two US cities as start and destination
- Get the optimal driving route via OpenRouteService API
- Automatically finds the cheapest fuel station every 450 miles
- Shows everything on an interactive Leaflet map
- Calculates total gallons used and total fuel cost
- Results are cached — repeat routes return instantly

---

## 📁 Project Structure

```
FuelRoutePlanner/
├── .env.example                        ← Copy to .env and fill in your values
├── .gitignore
├── docker-compose.yml                  ← Run everything with one command
│
├── backend/
│   ├── manage.py                       ← Django entry point
│   ├── requirements.txt                ← Python dependencies
│   ├── fuel_prices.csv                 ← Fuel station dataset (90+ US stations)
│   │
│   ├── config/
│   │   ├── settings.py                 ← All Django settings (reads from .env)
│   │   ├── urls.py                     ← Root URL routing
│   │   └── wsgi.py                     ← WSGI server entry
│   │
│   └── apps/fuel_route/
│       ├── models.py                   ← FuelStation database model
│       ├── serializers.py              ← Request validation
│       ├── views.py                    ← API endpoints (route, stations, health)
│       ├── urls.py                     ← App URL patterns
│       ├── migrations/
│       │   └── 0001_initial.py         ← Database schema
│       ├── services/
│       │   ├── routing.py              ← OpenRouteService API (geocode + directions)
│       │   ├── optimizer.py            ← Fuel stop selection algorithm
│       │   └── cost.py                 ← Total cost calculation
│       └── management/commands/
│           └── load_fuel_data.py       ← CSV → Database importer
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js                  ← Vite + /api proxy to Django
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx                    ← App entry, router, theme
        ├── index.css                   ← Tailwind + global styles
        ├── api.js                      ← All Axios API calls
        ├── hooks.js                    ← useRoute + useTheme hooks
        ├── components/
        │   ├── Navbar.jsx              ← Top navigation with dark mode toggle
        │   ├── RouteForm.jsx           ← Input form with quick examples
        │   ├── CostSummary.jsx         ← 4 stat cards (distance, gallons, cost, stops)
        │   ├── RouteMap.jsx            ← Leaflet interactive map
        │   └── FuelTable.jsx           ← Fuel stops table (desktop) + accordion (mobile)
        └── pages/
            ├── Home.jsx                ← Landing page with hero + features
            ├── Planner.jsx             ← Main planner page
            └── About.jsx               ← Tech stack + algorithm explanation
```

---

## 🚀 Setup Guide (Step by Step)

### Step 1 — Get a Free ORS API Key

1. Go to **https://openrouteservice.org/dev/#/signup**
2. Create a free account
3. Copy your API key (looks like: `5b3ce3597851110001cf6248...`)

---

### Step 2 — Configure Environment

In the **root folder**, copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Open `.env` and fill in your values:

```env
SECRET_KEY=any-long-random-string-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=fuelroute_db
DB_USER=postgres
DB_PASSWORD=your_postgres_password_here
DB_HOST=localhost
DB_PORT=5432

ORS_API_KEY=your_openrouteservice_key_here

FRONTEND_URL=http://localhost:5173
ROUTE_CACHE_TIMEOUT=3600
```

---

### Step 3 — Set Up PostgreSQL

Make sure PostgreSQL is installed. Then create the database:

```bash
# Open psql terminal
psql -U postgres

# Run these commands inside psql:
CREATE DATABASE fuelroute_db;
\q
```

> **Windows users:** PostgreSQL runs as a service. Check it's started in Task Manager → Services → `postgresql-x64-XX`.

> **Mac users:** `brew services start postgresql@16`

---

### Step 4 — Run the Backend

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate — Windows
venv\Scripts\activate

# Activate — Mac / Linux
source venv/bin/activate

# Install Python packages
pip install -r requirements.txt

# Create database tables
python manage.py migrate

# Load fuel station data from CSV
python manage.py load_fuel_data

# Start Django server
python manage.py runserver
```

Backend is now running at: **http://localhost:8000**

---

### Step 5 — Run the Frontend

Open a **new terminal** (keep the backend running):

```bash
cd frontend

# Install Node packages
npm install

# Start dev server
npm run dev
```

Frontend is now running at: **http://localhost:5173**

---

### Step 6 — Open the App

Go to **http://localhost:5173** in your browser.

Enter a start and destination (e.g. `New York, NY` → `Los Angeles, CA`) and click **Plan Route**.

---

## 🐳 Docker (Easiest Option)

If you have Docker Desktop installed, run everything with one command:

```bash
# Make sure .env is configured first, then:
docker-compose up --build
```

| Service  | URL                    |
|----------|------------------------|
| Frontend | http://localhost:5173  |
| Backend  | http://localhost:8000  |
| Database | localhost:5432         |

---

## 🧪 API Reference

### Base URL
```
http://localhost:8000/api
```

---

### `POST /api/route/` — Plan Route

**Request body:**
```json
{
  "start": "New York, NY",
  "finish": "Los Angeles, CA"
}
```

**Response:**
```json
{
  "start": "New York, NY",
  "finish": "Los Angeles, CA",
  "total_distance_miles": 2789.4,
  "total_gallons_used": 278.94,
  "total_fuel_cost_usd": 847.32,
  "vehicle_mpg": 10,
  "cached": false,
  "fuel_stops": [
    {
      "stop_number": 1,
      "station_name": "Sheetz",
      "city": "Columbus",
      "state": "OH",
      "lat": 39.9612,
      "lon": -82.9988,
      "price_per_gallon": 3.19,
      "miles_from_start": 463.2,
      "gallons_needed": 46.32,
      "cost_at_this_stop": 147.76
    }
  ],
  "route_geojson": { "type": "FeatureCollection", "features": [...] }
}
```

---

### `GET /api/health/` — Health Check

```json
{
  "status": "ok",
  "stations_loaded": 91,
  "message": "FuelRoutePlanner API is running."
}
```

---

### `GET /api/stations/` — List All Stations

```json
{
  "count": 91,
  "stations": [
    { "id": 1, "name": "Shell", "city": "Dallas", "state": "TX", "lat": 32.77, "lon": -96.79, "price_per_gallon": "2.890" }
  ]
}
```

---

## 🛠 Testing with Postman

1. Open Postman
2. Click **New → HTTP Request**
3. Set method to `POST`, URL to `http://localhost:8000/api/route/`
4. Go to **Body → raw → JSON** and paste:

```json
{
  "start": "Chicago, IL",
  "finish": "Houston, TX"
}
```

5. Click **Send**

---

## 🧠 How the Algorithm Works

```
1. Geocode "New York, NY"   → (40.71, -74.00)
2. Geocode "Los Angeles, CA" → (34.05, -118.24)
3. One ORS API call → full road path as GPS coordinates
4. Walk every point, measure Haversine distance
5. At 450 miles → bounding-box SQL query around current position
6. Filter candidates by precise Haversine distance (≤ 75 miles)
7. Pick the CHEAPEST station in range
8. Record stop, reset distance counter
9. Repeat until destination
10. Cache result for 1 hour (same route = instant return)
```

**Cost formula:**
```
gallons = segment_miles / 10 MPG
cost    = gallons × price_per_gallon
total   = sum of all stop costs
```

---

## 🐛 Troubleshooting

| Problem | Fix |
|---|---|
| `ORS_API_KEY is missing` | Add your key to `.env` — get it free at openrouteservice.org |
| `Connection refused` (PostgreSQL) | Make sure PostgreSQL service is running |
| `relation fuelstation does not exist` | Run `python manage.py migrate` then `python manage.py load_fuel_data` |
| CORS error in browser | Make sure Django is running on port 8000 |
| Map doesn't show | Check the browser console — usually a missing route result |
| `npm install` fails | Make sure Node.js 18+ is installed |

---

## ⚙️ Tech Stack

| Layer | Technology |
|---|---|
| Backend | Python 3.12, Django 5, Django REST Framework |
| Database | PostgreSQL 16 |
| Routing API | OpenRouteService (free tier) |
| Maps | Leaflet.js + OpenStreetMap tiles |
| Frontend | React 18, Vite, Tailwind CSS |
| HTTP Client | Axios |
| Caching | Django LocMemCache |
| Container | Docker + Docker Compose |

---

## 📦 Commands Reference

```bash
# Backend
python manage.py migrate              # Create/update database tables
python manage.py load_fuel_data       # Import fuel_prices.csv into DB
python manage.py load_fuel_data --csv /path/to/custom.csv  # Custom CSV
python manage.py runserver            # Start dev server

# Frontend
npm install      # Install packages
npm run dev      # Start dev server (http://localhost:5173)
npm run build    # Build for production (outputs to dist/)
npm run preview  # Preview production build locally
```

---

Built by **Shoaib Asghar**
