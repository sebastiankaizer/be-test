# NodeWave Backend Technical Assessment

Author: Kevin Edgard Halim
Position: Backend Engineer Candidate

## Overview
This repository contains a backend service built with Node.js, TypeScript, Express, and Prisma ORM for the NodeWave Backend Technical Assessment. The app showcases JWT-based authentication, asynchronous file processing jobs, a background worker, pagination, retry handling, structured logging, and a modular project layout.

## Tech Stack
- Language: TypeScript
- Framework: Express.js
- ORM: Prisma
- Database: MySQL
- Authentication: JWT
- Logging: Winston + Morgan
- Dev tools: Nodemon, ts-node

## Features
- JWT login and auth middleware (Bearer token)
- File processing jobs with PENDING -> IN_PROGRESS -> SUCCESS flow (placeholder logic)
- Retry only for FAILED jobs; attempts counter increments
- Pagination for file job listing
- Background worker using node-cron (runs every 5 seconds)
- Consistent response shape: { "content": {}, "message": "Success", "errors": [] }
- Module aliasing for clean imports

## Project Structure
be-test/
  prisma/
    migrations/
    seeds/
    schema.prisma
  src/
    app/
    controllers/
    middlewares/
    routes/
    services/
    server/
    utils/
    index.ts
  example.env
  package.json
  tsconfig.json
  README.md

Note: Example modules (ExampleController/Service/Routes) are kept as templates and references.

## Prerequisites
- Node.js >= 18 (minimum 16.14)
- MySQL >= 8
- npm

## Environment Setup
Create .env based on example.env:
```
DATABASE_URL="mysql://nodewave:nodewave123!@localhost:3306/nodewave"
SHADOW_DATABASE_URL="mysql://nodewave:nodewave123!@localhost:3306/nodewave_shadow"
NODE_LOCAL_PORT=3150
JWT_SECRET="AVERYSECRETjWTcoDE"
ENVIRONMENT=dev
ALLOWED_ORIGINS="*"
```

## Database Setup
Create the databases (adjust names as needed):
```
CREATE DATABASE nodewave;
CREATE DATABASE nodewave_shadow;
```
Generate Prisma client and run migration:
```
npx prisma generate
npx prisma migrate dev
```

## Installation
Install dependencies:
```powershell
npm install
```

## Running the Application
Start the REST API server (dev with hot reload):
```powershell
npm run dev -- --service=rest
```
The server listens on http://localhost:3150 (or NODE_LOCAL_PORT, default 3010 if not set).

Build and run the compiled app:
```powershell
npm run build
npm start -- --service=rest
```

## Authentication
Login
- Method: POST
- Path: /auth/login
- Body:
```json
{ "userId": "ken" }
```
- Response:
```json
{
  "content": { "token": "<JWT_TOKEN>" },
  "message": "Success",
  "errors": []
}
```
Use the token for protected endpoints:
```
Authorization: Bearer <JWT_TOKEN>
```

## File Processing API
1) Create file job
- Method: POST
- Path: /files
- Body:
```json
{ "fileUrl": "https://example.com/test.xlsx", "originalName": "test.xlsx" }
```

2) List file jobs (paginated)
- Method: GET
- Path: /files?page=1&rows=10

3) Get file job detail
- Method: GET
- Path: /files/:id

4) Retry failed job (only when status is FAILED)
- Method: POST
- Path: /files/:id/retry

## Background Worker Behavior
- Jobs are created as PENDING
- Worker picks the oldest PENDING, marks IN_PROGRESS, then SUCCESS (placeholder logic; replace with real file processing)
- FAILED -> retry -> PENDING -> SUCCESS
- Each retry increments attempts

## Response Format
All endpoints return a consistent structure:
```json
{ "content": {}, "message": "Success", "errors": [] }
```

## Notes
- .env is git-ignored
- File processing is simulated for the assessment; extend `startFileWorker` with real logic
- Prisma schema defines FileProcess and Product; migrations live in prisma/migrations

## Testing
Jest (JavaScript test runner) is configured, but no tests are included yet. Add tests under src/**/__tests__ then run:
```powershell
npm test
```
