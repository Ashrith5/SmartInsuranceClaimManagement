CREATE TABLE claims (
    id BIGSERIAL PRIMARY KEY,

    claim_number VARCHAR(50) NOT NULL UNIQUE,

    policy_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    claim_type VARCHAR(50) NOT NULL,

    incident_date DATE NOT NULL,

    claim_amount NUMERIC(15,2) NOT NULL,

    description VARCHAR(1000) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'SUBMITTED',

    submitted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    reviewed_at TIMESTAMP,

    decision_reason VARCHAR(1000),

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_claim_policy
        FOREIGN KEY (policy_id)
        REFERENCES policies(id),

    CONSTRAINT fk_claim_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT chk_claim_amount
        CHECK (claim_amount > 0),

    CONSTRAINT chk_claim_status
        CHECK (
            status IN (
                'SUBMITTED',
                'UNDER_REVIEW',
                'INFO_REQUESTED',
                'APPROVED',
                'REJECTED',
                'SETTLED',
                'WITHDRAWN'
            )
        )
);

CREATE INDEX idx_claims_policy_id
ON claims(policy_id);

CREATE INDEX idx_claims_user_id
ON claims(user_id);

CREATE INDEX idx_claims_status
ON claims(status);

CREATE INDEX idx_claims_submitted_at
ON claims(submitted_at);