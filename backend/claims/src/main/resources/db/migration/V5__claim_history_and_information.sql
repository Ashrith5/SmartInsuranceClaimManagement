CREATE TABLE claim_information_requests (
    id BIGSERIAL PRIMARY KEY,

    claim_id BIGINT NOT NULL,

    requested_by BIGINT NOT NULL,

    request_message VARCHAR(1000) NOT NULL,

    customer_response VARCHAR(1000),

    requested_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    responded_at TIMESTAMP,

    status VARCHAR(30) NOT NULL DEFAULT 'OPEN',

    CONSTRAINT fk_claim_info_claim
        FOREIGN KEY (claim_id)
        REFERENCES claims(id),

    CONSTRAINT fk_claim_info_requested_by
        FOREIGN KEY (requested_by)
        REFERENCES users(id),

    CONSTRAINT chk_claim_info_status
        CHECK (
            status IN (
                'OPEN',
                'RESPONDED',
                'CLOSED'
            )
        )
);


CREATE TABLE claim_history (
    id BIGSERIAL PRIMARY KEY,

    claim_id BIGINT NOT NULL,

    previous_status VARCHAR(30),

    new_status VARCHAR(30) NOT NULL,

    changed_by BIGINT NOT NULL,

    action VARCHAR(100) NOT NULL,

    remarks VARCHAR(1000),

    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_claim_history_claim
        FOREIGN KEY (claim_id)
        REFERENCES claims(id),

    CONSTRAINT fk_claim_history_changed_by
        FOREIGN KEY (changed_by)
        REFERENCES users(id)
);


CREATE INDEX idx_claim_info_claim
ON claim_information_requests(claim_id);

CREATE INDEX idx_claim_info_status
ON claim_information_requests(status);


CREATE INDEX idx_claim_history_claim
ON claim_history(claim_id);

CREATE INDEX idx_claim_history_changed_at
ON claim_history(changed_at);