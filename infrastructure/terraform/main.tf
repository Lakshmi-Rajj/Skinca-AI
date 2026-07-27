terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

module "vpc" {
  source      = "./modules/vpc"
  environment = var.environment
  aws_region  = var.aws_region
}

module "aurora" {
  source          = "./modules/aurora_postgresql"
  environment     = var.environment
  vpc_id          = module.vpc.vpc_id
  vpc_cidr        = module.vpc.vpc_cidr
  subnet_ids      = module.vpc.private_subnet_ids
  master_password = var.db_master_password
}

module "redis" {
  source      = "./modules/elasticache_redis"
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  vpc_cidr    = module.vpc.vpc_cidr
  subnet_ids  = module.vpc.private_subnet_ids
}

module "ecs" {
  source      = "./modules/ecs_fargate"
  environment = var.environment
  vpc_id      = module.vpc.vpc_id
  subnet_ids  = module.vpc.private_subnet_ids
}

module "cdn" {
  source      = "./modules/s3_cloudfront"
  environment = var.environment
}

module "messaging" {
  source      = "./modules/sqs_eventbridge"
  environment = var.environment
}
