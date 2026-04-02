# Haulage Management System - Frontend

React frontend for the Haulage Management System using Vite.

## Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

Build for production:
```bash
npm run build
```

### Preview

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
src/
  ├── App.jsx           # Main App component
  ├── App.css           # App styles
  ├── index.css         # Global styles
  └── main.jsx          # React entry point

index.html             # HTML entry point
vite.config.js         # Vite configuration
package.json           # Dependencies and scripts
```

## Features

- **Drivers Management** - Manage driver profiles and assignments
- **Trucks Management** - Monitor and manage vehicle fleet
- **Jobs Management** - Track and manage haulage jobs

## API Integration

The frontend is configured to proxy API requests to the Spring Boot backend at `http://localhost:8080`.

API calls to `/api/*` will be forwarded to the backend.

## Technologies

- React 18
- Vite (build tool)
- ESLint (code linting)

## Development Notes

- Hot Module Replacement (HMR) is enabled by default
- Proxy configuration for backend API in `vite.config.js`
