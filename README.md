# Name Registry

Name Registry is a simple full-stack web application designed for learning production-style deployment on AWS. It lets users add names, view the registry, and remove entries. The application is built to be container-friendly and easy to deploy behind an Application Load Balancer in a cloud environment.

## Features

- Add a person name through a clean web interface
- View all stored names in a registration list
- Delete any registered name
- REST API for health checks and data operations
- Environment variable configuration
- Docker-ready container setup
- Production-friendly app startup on port 3000

## Prerequisites

Before running the project, make sure you have:

- Node.js 18 or later
- npm
- Docker and Docker Compose (for containerized setup)

## Local Installation

1. Clone or open the project directory.
2. Install dependencies:

```bash
npm install
```

3. Copy the example environment file:

```bash
copy .env.example .env
```

4. Update the values if needed.

## Running Locally

Start the application in development mode:

```bash
npm start
```

The app will listen on:

```text
http://localhost:3000
```

### Health check

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "healthy"
}
```

## Running with Docker

Build the image:

```bash
docker build -t name-registry .
```

Run the container:

```bash
docker run -p 3000:3000 --env-file .env name-registry
```

You can also use Docker Compose:

```bash
docker-compose up --build
```

Then open:

```text
http://localhost:3000
```

## API Endpoints

### Health check

- GET /health

Response:

```json
{
  "status": "healthy"
}
```

### Get all names

- GET /api/names

Response:

```json
[
  {
    "id": "1",
    "name": "Sai Krishna",
    "createdAt": "2026-09-01T00:00:00.000Z"
  }
]
```

### Add a name

- POST /api/names

Request body:

```json
{
  "name": "Sai Krishna"
}
```

Response:

```json
{
  "id": "1",
  "name": "Sai Krishna",
  "createdAt": "2026-09-01T00:00:00.000Z"
}
```

### Delete a name

- DELETE /api/names/:id

Response:

```json
{
  "message": "Name deleted successfully"
}
```

## Environment Variables

The application supports MySQL connection settings for shared AWS storage. Use either a full MySQL URL or individual environment variables:

```env
PORT=3000
HOST=0.0.0.0
NODE_ENV=development
DATABASE_URL=mysql://app_user:secret@mysql:3306/name_registry
# or
MYSQL_HOST=your-rds-endpoint.amazonaws.com
MYSQL_PORT=3306
MYSQL_USER=app_user
MYSQL_PASSWORD=your_password
MYSQL_DATABASE=name_registry
```

## Docker Configuration

The project includes:

- Dockerfile
- .dockerignore
- docker-compose.yml

These files are designed to make the application portable and suitable for deployment using Docker and AWS infrastructure.

## Deployment Notes

The app is configured for MySQL so multiple application instances can share the same database in AWS, including Amazon RDS. The database configuration is environment-driven rather than hardcoded, so you can point it to a shared MySQL instance across multiple servers.

## Verify the Application

Open the app in a browser:

```text
http://localhost:3000
```

Verify the health endpoint:

```text
http://localhost:3000/health
```

You should see the JSON response:

```json
{
  "status": "healthy"
}
```

## Project Structure

```text
name-registry/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── database/
│   │   └── db.js
│   ├── services/
│   │   └── nameService.js
│   └── routes/
├── public/
│   └── index.html
├── test/
│   └── api.test.js
├── .dockerignore
├── .env.example
├── Dockerfile
├── docker-compose.yml
├── package.json
├── README.md
└── .gitignore
```
