# Project Overview

This project is a full-stack web application that consists of a frontend and a backend.

- **Frontend**: Built using React, TypeScript, and Vite. It includes modern tooling and ESLint for linting.
- **Backend**: Developed with Node.js and Express, providing RESTful APIs for the application.

The application is designed to be deployed on Google Cloud Run, utilizing containerization for easy deployment and scalability.

# To Run the Docker Containers

## Prerequisites

- **Docker** or **Podman** installed on your machine
- **Node.js** (>=18) for local development

### To install Podman and Podman Compose (macOS):

```bash
brew install podman
brew install podman-compose
podman machine init
podman machine start
```

## Steps to Run the Docker Containers

1. Navigate to the root directory of the project (where the `podman-compose.yml` or `docker-compose.yml` file is located).

2. Build and run both frontend and backend using:
   ```bash
   podman-compose up --build
   ```
