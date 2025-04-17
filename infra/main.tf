provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_cloud_run_service" "backend" {
  name = "avdhut-notes-backend"
  location = var.region
  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/avdhut-notes-backend:latest"
        ports {
          container_port = 3000
        }
        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }
      container_concurrency = 100
    }
  }
  traffic {
    percent = 100
    latest_revision = true
  }
}

resource "google_cloud_run_service" "frontend" {
  name = "avdhut-notes-frontend"
  location = var.region
  template {
    spec {
      containers {
        image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/avdhut-notes-frontend:latest"
        ports {
          container_port = 8080
        }
        resources {
          limits = {
            cpu    = "1"
            memory = "512Mi"
          }
        }
      }
      container_concurrency = 100
    }
  }
  traffic {
    percent = 100
    latest_revision = true
  }
}