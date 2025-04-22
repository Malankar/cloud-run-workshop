provider "google" {
  project = var.project_id
  region  = var.region
}

resource "google_artifact_registry_repository" "repo" {
  provider      = google
  location      = var.region
  repository_id = var.repo
  format        = "DOCKER"

  lifecycle {
    ignore_changes = all
  }
}

resource "null_resource" "build_and_push_image" {
  triggers = {
    # Forces re-execution on every terraform apply
    always_run = "${timestamp()}"
  }

  provisioner "local-exec" {
    command = <<EOT
      # Authenticate Docker with Google Artifact Registry
      cd ..
      gcloud auth configure-docker ${var.region}-docker.pkg.dev
      gcloud builds submit --config=cloudbuild.yaml --substitutions=_REGION=${var.region},_PROJECT_ID=${var.project_id},_REPO=${var.repo}
    EOT
  }

  depends_on = [google_artifact_registry_repository.repo]
}

resource "google_cloud_run_v2_service" "backend" {
  name                = "avdhut-notes-backend"
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

  depends_on = [null_resource.build_and_push_image]
}

resource "google_cloud_run_v2_service" "frontend" {
  name                = "avdhut-notes-frontend"
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

  depends_on = [null_resource.build_and_push_image, google_cloud_run_v2_service.backend]
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
