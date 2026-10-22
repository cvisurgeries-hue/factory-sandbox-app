# Harmless Terraform stub for the factory's live checks (the terraform shim,
# infra drift and forbidden-path refusals). It creates no cloud resources.

terraform {
  required_version = ">= 1.5"
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.2"
    }
  }
}

variable "environment" {
  type    = string
  default = "sandbox"
}

resource "null_resource" "marker" {
  triggers = {
    environment = var.environment
  }
}

output "environment" {
  value = var.environment
}
