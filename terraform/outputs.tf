output "application_public_ip" {
  description = "Public IPv4 address of the application EC2 instance."
  value       = aws_instance.app.public_ip
}

output "application_url" {
  description = "HTTP URL for the deployed application."
  value       = "http://${aws_instance.app.public_ip}"
}

output "database_endpoint" {
  description = "Private PostgreSQL RDS endpoint."
  value       = aws_db_instance.postgres.address
}

output "claim_documents_bucket" {
  description = "S3 bucket for claim document storage."
  value       = aws_s3_bucket.claim_documents.bucket
}
