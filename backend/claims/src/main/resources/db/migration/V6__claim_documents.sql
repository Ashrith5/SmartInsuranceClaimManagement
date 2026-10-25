CREATE TABLE claim_documents (
    id BIGSERIAL PRIMARY KEY,

    claim_id BIGINT NOT NULL,

    uploaded_by BIGINT NOT NULL,

    original_file_name VARCHAR(255) NOT NULL,

    stored_file_name VARCHAR(255) NOT NULL,

    file_path VARCHAR(500) NOT NULL,

    content_type VARCHAR(100) NOT NULL,

    file_size BIGINT NOT NULL,

    document_type VARCHAR(50) NOT NULL,

    uploaded_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_claim_document_claim
        FOREIGN KEY (claim_id)
        REFERENCES claims(id),

    CONSTRAINT fk_claim_document_user
        FOREIGN KEY (uploaded_by)
        REFERENCES users(id),

    CONSTRAINT chk_claim_document_size
        CHECK (file_size > 0)
);

CREATE INDEX idx_claim_documents_claim
ON claim_documents(claim_id);

CREATE INDEX idx_claim_documents_uploaded_by
ON claim_documents(uploaded_by);

CREATE INDEX idx_claim_documents_type
ON claim_documents(document_type);