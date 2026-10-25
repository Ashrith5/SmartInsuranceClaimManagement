CREATE TABLE claim_settlements (
    id BIGSERIAL PRIMARY KEY,

    settlement_number VARCHAR(50) NOT NULL UNIQUE,

    claim_id BIGINT NOT NULL UNIQUE,

    processed_by BIGINT NOT NULL,

    settlement_amount NUMERIC(15,2) NOT NULL,

    payment_reference VARCHAR(100) NOT NULL UNIQUE,

    settlement_status VARCHAR(30) NOT NULL DEFAULT 'COMPLETED',

    settled_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_settlement_claim
        FOREIGN KEY (claim_id)
        REFERENCES claims(id),

    CONSTRAINT fk_settlement_processed_by
        FOREIGN KEY (processed_by)
        REFERENCES users(id),

    CONSTRAINT chk_settlement_amount
        CHECK (settlement_amount > 0),

    CONSTRAINT chk_settlement_status
        CHECK (
            settlement_status IN (
                'COMPLETED',
                'FAILED'
            )
        )
);

CREATE INDEX idx_settlement_claim
ON claim_settlements(claim_id);

CREATE INDEX idx_settlement_status
ON claim_settlements(settlement_status);

CREATE INDEX idx_settlement_date
ON claim_settlements(settled_at);