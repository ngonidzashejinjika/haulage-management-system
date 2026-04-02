# Running the Haulage Management System

## Prerequisites

You need **one** of the following:
- **Java 17+** (JDK)
- **Docker Desktop**

---

## Option 1: Run with Java (Quickest)

### Step 1: Install Java
Download and install [JDK 17 or newer](https://www.oracle.com/java/technologies/downloads/)

### Step 2: Start the Backend
```bash
cd c:\Users\Ngoni\haulage-springboot
java -jar target/haulage-0.0.1-SNAPSHOT.jar
```

The backend will start on `http://localhost:8080`

### Step 3: Frontend is Already Running
Frontend is running on `http://localhost:3000`

---

## Option 2: Run with Docker Compose

### Step 1: Start Docker Desktop
Open the Docker Desktop application from your system

### Step 2: Run Docker Compose
```bash
cd c:\Users\Ngoni\haulage-springboot
docker-compose up --build
```

This will:
- Build the Spring Boot application
- Start PostgreSQL database
- Start the backend on `http://localhost:8080`

### Step 3: Access the Application
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:8080/api`

---

## Application URLs

Once backend is running:
- **Frontend Dashboard**: http://localhost:3000
- **Backend API**: http://localhost:8080/api
- **Swagger UI** (API Docs): http://localhost:8080/swagger-ui/index.html

---

## Default Credentials (After Setup)

Create a new account first:
1. Go to http://localhost:3000/register
2. Create a username and password
3. Login with those credentials

---

## Troubleshooting

### "java: command not found"
- Java is not installed or not in PATH
- Solution: Install Java from oracle.com

### "Docker daemon is not running"
- Docker Desktop is not started
- Solution: Open Docker Desktop application

### Registration fails with "Failed to connect"
- Backend is not running on port 8080
- Solution: Start the backend first

### CORS errors in browser console
- Should be fixed with the configuration update
- Make sure backend has been rebuilt/restarted

---

## Architecture

```
┌─────────────────────────────────────┐
│      React Frontend (3000)          │
│  ├─ Login/Register                  │
│  ├─ Dashboard                       │
│  ├─ Drivers Management              │
│  ├─ Trucks Management               │
│  └─ Jobs Management                 │
└──────────────┬──────────────────────┘
               │ HTTP/REST
┌──────────────▼──────────────────────┐
│   Spring Boot Backend (8080)        │
│  ├─ Auth Endpoints                  │
│  ├─ Driver Service                  │
│  ├─ Truck Service                   │
│  ├─ Job Service                     │
│  └─ JWT Security                    │
└──────────────┬──────────────────────┘
               │ JDBC
┌──────────────▼──────────────────────┐
│    PostgreSQL Database              │
│  ├─ Users Table                     │
│  ├─ Drivers Table                   │
│  ├─ Trucks Table                    │
│  └─ Jobs Table                      │
└─────────────────────────────────────┘
```

---

## Development

### Frontend
```bash
cd Frontend
pnpm dev         # Start dev server on port 3000
pnpm build       # Build for production
```

### Backend
```bash
# With Java installed
java -jar target/haulage-0.0.1-SNAPSHOT.jar

# With Docker
docker-compose up
```

To rebuild the backend with Maven:
```bash
mvn clean package
```
