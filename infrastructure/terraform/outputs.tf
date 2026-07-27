output "aurora_endpoint" {
  value = module.aurora.cluster_endpoint
}

output "redis_endpoint" {
  value = module.redis.redis_endpoint
}

output "cloudfront_cdn_domain" {
  value = module.cdn.cloudfront_domain_name
}

output "sqs_queue_url" {
  value = module.messaging.sqs_queue_url
}
