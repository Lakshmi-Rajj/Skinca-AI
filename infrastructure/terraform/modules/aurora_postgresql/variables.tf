variable "environment" { type = string }
variable "vpc_id" { type = string }
variable "vpc_cidr" { type = string }
variable "subnet_ids" { type = list(string) }
variable "database_name" { type = string; default = "skincare_db" }
variable "master_username" { type = string; default = "postgres" }
variable "master_password" { type = string; sensitive = true }
