# Project Overview

This project is a full-stack web application that consists of a frontend and a backend.

- **Frontend**: Built using React, TypeScript, and Vite. It includes modern tooling and ESLint for linting.
- **Backend**: Developed with Node.js and Express, providing RESTful APIs for the application.

The application is designed to be deployed on Google Cloud Run, utilizing containerization for easy deployment and scalability.

## Deployment and Infrastructure

This project includes:

- Docker containers for local development
- Google Cloud Build for CI/CD automation
- Terraform configuration for infrastructure as code
- Google Cloud Run for serverless container deployment

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
  --port 3000 \
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
  --port 8080 \
  --cpu 1 \
  --memory 512Mi \
  --concurrency 100
```

# CI/CD with Cloud Build

The project includes a `cloudbuild.yaml` file that automates the build and push process to Google Container Registry. To trigger a build:

```bash
gcloud builds submit --config=cloudbuild.yaml \
  --substitutions=_REGION=$REGION,_PROJECT_ID=$PROJECT_ID,_REPO=$REPO
```

# Infrastructure as Code with Terraform

The `/infra` directory contains Terraform configuration files to provision and manage the Google Cloud Run services.

## Terraform Files
- `main.tf` - Main configuration for Cloud Run services
- `variables.tf` - Variable definitions
- `terraform.tfvars` - Variable values

## Importing Existing Resources

If the Cloud Run services already exist and you're getting errors about resources already existing, import them into your Terraform state:

```bash
cd infra
terraform init
# Set your environment variables
export PROJECT_ID=cloudrun-workshop-2025
export REGION=us-central1

# Import existing Cloud Run services
terraform import google_cloud_run_service.backend $REGION/$PROJECT_ID/avdhut-notes-backend
terraform import google_cloud_run_service.frontend $REGION/$PROJECT_ID/avdhut-notes-frontend
```

## Deploying with Terraform

```bash
cd infra
terraform plan
terraform apply
```

This will create or update the Cloud Run services for both frontend and backend using the infrastructure as code approach, ensuring consistent environments and deployments.
