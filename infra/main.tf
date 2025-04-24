provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_artifact_registry_repository" "repo" {
  provider      = google
  location      = var.region
  repository_id = var.repo
  format        = "DOCKER"
}

resource "null_resource" "build_and_push_backend_image" {
  triggers = {
    # Forces re-execution on every terraform apply
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      # Authenticate Docker with Google Artifact Registry
      cd ..
      gcloud auth configure-docker ${var.region}-docker.pkg.dev
      docker build --platform linux/amd64 -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.backend_image_name}:latest ./backend
      docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.backend_image_name}:latest
    EOT
  }

  depends_on = [google_artifact_registry_repository.repo]
}

resource "google_cloud_run_v2_service" "backend" {
  name                = var.backend_image_name
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.backend_image_name}:latest"

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
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [null_resource.build_and_push_backend_image]
}

# Get the backend URL
data "google_cloud_run_v2_service" "backend" {
  name     = var.backend_image_name
  location = var.region

  depends_on = [google_cloud_run_v2_service.backend]
}

resource "null_resource" "build_and_push_frontend_image" {
  triggers = {
    # Forces re-execution on every terraform apply
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      # Authenticate Docker with Google Artifact Registry
      cd ..
      gcloud auth configure-docker ${var.region}-docker.pkg.dev
      docker build --platform linux/amd64 --build-arg VITE_BACKEND_URL=${data.google_cloud_run_v2_service.backend.uri} -t ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.frontend_image_name}:latest ./frontend
      docker push ${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.frontend_image_name}:latest
    EOT
  }

  depends_on = [google_cloud_run_v2_service.backend]
}

resource "google_cloud_run_v2_service" "frontend" {
  name                = var.frontend_image_name
  location            = var.region
  deletion_protection = false

  template {
    containers {
      image = "${var.region}-docker.pkg.dev/${var.project_id}/${var.repo}/${var.frontend_image_name}:latest"

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
  }

  traffic {
    percent = 100
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
  }

  depends_on = [null_resource.build_and_push_frontend_image]
}

resource "google_cloud_run_service_iam_member" "backend" {
  location = google_cloud_run_v2_service.backend.location
  service  = google_cloud_run_v2_service.backend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
resource "google_cloud_run_service_iam_member" "frontend" {
  location = google_cloud_run_v2_service.frontend.location
  service  = google_cloud_run_v2_service.frontend.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
