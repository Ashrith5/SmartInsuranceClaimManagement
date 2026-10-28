resource "aws_s3_bucket" "claim_documents" {
  bucket_prefix = "${var.project_name}-${var.environment}-claims-"

  force_destroy = true

  tags = {
    Name = "${var.project_name}-${var.environment}-claim-documents"
  }
}

resource "aws_s3_bucket_public_access_block" "claim_documents" {
  bucket = aws_s3_bucket.claim_documents.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}
