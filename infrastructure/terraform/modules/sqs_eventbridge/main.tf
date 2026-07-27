resource "aws_sqs_queue" "telemetry_dlq" {
  name                      = "${var.environment}-telemetry-dlq"
  message_retention_seconds = 1209600
}

resource "aws_sqs_queue" "telemetry_queue" {
  name                      = "${var.environment}-telemetry-queue"
  delay_seconds             = 0
  max_message_size          = 262144
  message_retention_seconds = 86400
  receive_wait_time_seconds = 10

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.telemetry_dlq.arn
    maxReceiveCount     = 5
  })
}

resource "aws_cloudwatch_event_bus" "skincare" {
  name = "${var.environment}-skincare-event-bus"
}
