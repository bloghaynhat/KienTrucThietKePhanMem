# Buoi 8 - Orchestration-Driven SOA Travel Booking System

This workspace contains a complete sample implementation of the travel booking assignment using an orchestration-driven SOA design.

## Services
- Frontend: `192.168.1.15:3000`
- Orchestrator: `192.168.1.10:8080`
- User Service: `192.168.1.11:8081`
- Tour Service: `192.168.1.12:8082`
- Booking Service: `192.168.1.13:8083`
- Payment Service: `192.168.1.14:8084`

## Flow
1. Frontend calls only the Orchestrator.
2. Orchestrator validates the user via User Service.
3. Orchestrator loads tour data via Tour Service.
4. Orchestrator creates a booking via Booking Service.
5. Orchestrator processes payment via Payment Service.
6. Frontend receives the combined result.

## Run locally without Docker
Open each folder in a terminal and run `npm install` then `npm start`.

## Run with Docker Compose
```bash
docker compose up --build
```

## Frontend configuration
Set `VITE_ORCHESTRATOR_URL` to the Orchestrator URL when running on LAN, for example:

```bash
VITE_ORCHESTRATOR_URL=http://192.168.1.10:8080
```

## Default demo accounts
- `admin / 123456`
- `huy / 123456`
- `linh / 123456`
