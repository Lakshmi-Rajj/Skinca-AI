output "s3_bucket_name" {
  value = aws_s3_bucket.widget_assets.id
}

output "cloudfront_domain_name" {
  value = aws_cloudfront_distribution.cdn.domain_name
}
