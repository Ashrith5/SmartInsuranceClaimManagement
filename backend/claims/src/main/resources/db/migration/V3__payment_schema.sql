CREATE TABLE payments (
    id BIGSERIAL PRIMARY KEY,

    transaction_id VARCHAR(60) NOT NULL UNIQUE,

    policy_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,

    amount NUMERIC(15,2) NOT NULL,

    payment_method VARCHAR(30) NOT NULL,
    payment_status VARCHAR(30) NOT NULL,

    payment_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_payment_policy
        FOREIGN KEY (policy_id)
        REFERENCES policies(id),

    CONSTRAINT fk_payment_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT chk_payment_amount
        CHECK (amount > 0),

    CONSTRAINT chk_payment_method
        CHECK (
            payment_method IN (
                'CARD',
                'UPI',
                'NET_BANKING'
            )
        ),

    CONSTRAINT chk_payment_status
        CHECK (
            payment_status IN (
                'SUCCESS',
                'FAILED'
            )
        )
);

CREATE INDEX idx_payments_policy_id
ON payments(policy_id);

CREATE INDEX idx_payments_user_id
ON payments(user_id);

CREATE INDEX idx_payments_status
ON payments(payment_status);

CREATE INDEX idx_payments_date
ON payments(payment_date);