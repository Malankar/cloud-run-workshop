variable "project_id" {
  description = "The ID of the project in which the resources will be created."
  type        = string
}
variable "region" {
  description = "The region in which the resources will be created."
  type        = string
}
variable "repo" {
  description = "The name of the repository."
  type        = string
}
variable "backend_image_name" {
  description = "The name of the backend image."
  type        = string
}
variable "frontend_image_name" {
  description = "The name of the frontend image."
  type        = string
}