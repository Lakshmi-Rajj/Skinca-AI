variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "environment" {
  type    = string
  default = "staging"
}

variable "db_master_password" {
  type      = string
  default   = "SuperSecretPassword123!"
  sensitive = true
}
