output "sqs_queue_url" {
  value = aws_sqs_queue.telemetry_queue.url
}

output "sqs_queue_arn" {
  value = aws_sqs_queue.telemetry_queue.arn
}

output "event_bus_name" {
  value = aws_cloudwatch_event_bus.skincare.name
}
