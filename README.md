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

# Google Cloud Run Deployment

## GCloud Authentication

```bash
gcloud auth login
gcloud auth configure-docker
gcloud auth configure-docker us-central1-docker.pkg.dev
```

If auth fails, try the following command:

```bash
docker login -u oauth2accesstoken --password-stdin https://$REGION-docker.pkg.dev
```

## GCP Details

```bash
PROJECT_ID=cloudrun-workshop-2025
REGION=us-central1
REPO=docker-images
```

## Build and Push Backend

```bash
docker build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-backend:latest ./backend

docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-backend:latest
```

## Build and Push Frontend

```bash
docker build --platform linux/amd64 -t $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-frontend:latest ./frontend 

docker push $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-frontend:latest
```

## Deploy Backend

```bash
gcloud run deploy avdhut-notes-backend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-backend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 100
```

## Deploy Frontend

```bash
gcloud run deploy avdhut-notes-frontend \
  --image $REGION-docker.pkg.dev/$PROJECT_ID/$REPO/avdhut-notes-frontend:latest \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 3000 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 100
```
