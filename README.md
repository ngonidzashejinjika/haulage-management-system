# Haulage Management System

A full-stack web application for managing trucks, drivers, and jobs in a haulage business. Built with Spring Boot (backend) and React (frontend), featuring JWT authentication, PostgreSQL database, and Docker support.

## Features

- **User Authentication**: JWT-based login and registration
- **Truck Management**: CRUD operations for trucks with status tracking
- **Driver Management**: CRUD operations for drivers with active job constraints
- **Job Management**: Create jobs, assign trucks and drivers, track status transitions
- **Business Logic**: Automated status updates and validation rules
- **RESTful API**: Comprehensive API with Swagger documentation
- **Modern Frontend**: React application with routing and API integration

## Tech Stack

- **Backend**: Java 17, Spring Boot 3, Spring Security, JWT, Hibernate, PostgreSQL
- **Frontend**: React 18, Vite, React Router, Axios
- **Database**: PostgreSQL
- **Containerization**: Docker & Docker Compose
- **Build Tools**: Maven (backend), pnpm (frontend)

## Prerequisites

- Java 17 or higher
- Node.js 18+ and pnpm
- Docker and Docker Compose
- Git

## Project Structure

```
haulage-management-system/
├── src/main/java/com/haulage/          # Spring Boot backend
│   ├── config/                         # Configuration classes
│   ├── controller/                     # REST controllers
│   ├── domain/                         # JPA entities
│   ├── dto/                            # Data transfer objects
│   ├── repository/                     # JPA repositories
│   ├── security/                       # Security configuration
│   └── service/                        # Business logic
├── src/main/resources/                 # Application properties
├── Frontend/                           # React frontend
│   ├── src/
│   │   ├── components/                 # React components
│   │   ├── pages/                      # Page components
│   │   ├── services/                   # API services
│   │   └── context/                    # React context
│   ├── package.json
│   └── vite.config.js
├── docker-compose.yml                  # Docker services
├── Dockerfile                          # Backend container
└── pom.xml                             # Maven configuration
```

## Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/ngonidzashejinjika/haulage-management-system.git
cd haulage-management-system
```

### 2. Run with Docker (Recommended)

```bash
# Build and start all services
docker-compose up --build
```

This will start:
- PostgreSQL database on port 5432
- Spring Boot backend on port 8080
- Access the app at `http://localhost:8080` (backend API)

### 3. Run Frontend Locally

```bash
# Install dependencies
cd Frontend
pnpm install

# Start development server
pnpm dev
```

Frontend will be available at `http://localhost:3000`

### 4. Run Backend Locally

Ensure PostgreSQL is running locally, then:

```bash
# Build and run
mvn spring-boot:run
```

Or run in your IDE.

## API Documentation

### Base URL
- Local: `http://localhost:8080`
- Docker: `http://localhost:8080`

### Swagger UI
- `http://localhost:8080/swagger-ui.html`

### Authentication
The API uses JWT tokens. Register/login to get a token, then include in requests:
```
Authorization: Bearer <your-jwt-token>
```

## API Examples (curl)

### 1) Register

```bash
curl -X POST "http://localhost:8080/api/auth/register" \
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

Set the token for subsequent requests:
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

### 5) Create a Job

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

### 6) Update Job Status

Set job to `IN_TRANSIT`:
```bash
curl -X PATCH "http://localhost:8080/api/jobs/1/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"status": "IN_TRANSIT"}'
```

Set job to `DELIVERED`:
```bash
curl -X PATCH "http://localhost:8080/api/jobs/1/status" \
  -H "Content-Type: application/json" \
  -H "$AUTH" \
  -d '{"status": "DELIVERED"}'
```

## Business Rules

- **Truck Assignment**: Trucks must be `AVAILABLE` to be assigned to jobs
- **Driver Constraints**: Drivers can only have one active job at a time
- **Status Transitions**:
  - Job `IN_TRANSIT` → Truck `IN_TRANSIT`
  - Job `DELIVERED`/`CANCELLED` → Truck `AVAILABLE`

## Configuration

### Database
Default credentials (Docker):
- Database: `haulage`
- Username: `haulage`
- Password: `haulage`
- Port: `5432`

### JWT
- Secret: `replace-me-with-a-long-random-secret` (change in production)
- Expiration: 1 hour

## Development

### Backend
```bash
# Run tests
mvn test

# Build JAR
mvn clean package

# Run with different profile
mvn spring-boot:run -Dspring-boot.run.profiles=local
```

### Frontend
```bash
cd Frontend

# Install dependencies
pnpm install

# Development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Lint code
pnpm lint
```

## Deployment

### Docker Production
```bash
# Build and run
docker-compose up --build -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Manual Deployment
1. Build backend JAR
2. Configure PostgreSQL
3. Set environment variables
4. Run JAR: `java -jar target/haulage-0.0.1-SNAPSHOT.jar`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes
4. Add tests
5. Submit a pull request

## License

This project is licensed under the MIT License.

