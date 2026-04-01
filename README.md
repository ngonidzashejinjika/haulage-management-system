# Haulage Truck Management System (Spring Boot)

CRUD for `Truck`, `Driver`, and `Job`, with job assignment + status transition business rules and JWT authentication.

## Run with Docker (recommended)

1. Start the stack:
   - `docker-compose up --build`
2. API base URL:
   - `http://localhost:8080`
3. Swagger UI:
   - `http://localhost:8080/swagger-ui.html`

Default PostgreSQL credentials (from `docker-compose.yml`):
- DB: `haulage`
- User: `haulage`
- Password: `haulage`

JWT secret (from `docker-compose.yml`): `replace-me-with-a-long-random-secret`

## Run locally

Make sure PostgreSQL is available, then run the app (e.g. via your IDE).

Base datasource defaults (from `application.yml`):
- URL: `jdbc:postgresql://localhost:5432/haulage`
- User: `haulage`
- Password: `haulage`

## API Examples (curl)

### 1) Register

```bash
curl -s -X POST "http://localhost:8080/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "demo123456"
  }'
```

### 2) Login (get JWT)

```bash
curl -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "demo123456"
  }'
```

Optional (Linux/macOS) if you have `jq` installed:

```bash
TOKEN=$(curl -s -X POST "http://localhost:8080/api/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "username": "demo",
    "password": "demo123456"
  }' | jq -r .token)
```

Copy the `token` field from the JSON response and set:

```bash
export AUTH="Authorization: Bearer <TOKEN>"
```

### 3) Create a Truck

```bash
curl -X POST "http://localhost:8080/api/trucks" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "registrationNumber": "REG-001",
    "capacity": 100.50
  }'
```

### 4) Create a Driver

```bash
curl -X POST "http://localhost:8080/api/drivers" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "name": "John Doe",
    "licenseNumber": "LIC-123456",
    "phoneNumber": "+263700000000"
  }'
```

### 5) Create a Job (assigns truck + driver)

```bash
curl -X POST "http://localhost:8080/api/jobs" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "truckId": 1,
    "driverId": 1,
    "pickupLocation": "Harare",
    "deliveryLocation": "Bulawayo",
    "cargoDescription": "General freight"
  }'
```

### 6) Update Job Status (and truck availability)

Set job to `IN_TRANSIT` (truck becomes `IN_TRANSIT`):

```bash
curl -X PATCH "http://localhost:8080/api/jobs/1/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "status": "IN_TRANSIT"
  }'
```

Set job to `DELIVERED` (truck becomes `AVAILABLE`):

```bash
curl -X PATCH "http://localhost:8080/api/jobs/1/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{
    "status": "DELIVERED"
  }'
```

## Status rules (business logic)

- A `Truck` can only be assigned to a new job when its status is `AVAILABLE`.
- A `Driver` can only have one active job at a time (`PENDING`, `ASSIGNED`, `IN_TRANSIT`).
- When a job becomes `IN_TRANSIT`, the assigned truck becomes `IN_TRANSIT`.
- When a job becomes `DELIVERED` or `CANCELLED`, the assigned truck becomes `AVAILABLE`.

