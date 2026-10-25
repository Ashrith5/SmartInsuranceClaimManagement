CREATE TABLE products (
    id BIGSERIAL PRIMARY KEY,
    product_name VARCHAR(150) NOT NULL,
    product_category VARCHAR(50) NOT NULL,
    coverage_amount NUMERIC(15,2) NOT NULL,
    premium_amount NUMERIC(15,2) NOT NULL,
    policy_tenure_months INTEGER NOT NULL,
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_product_coverage
        CHECK (coverage_amount > 0),

    CONSTRAINT chk_product_premium
        CHECK (premium_amount > 0),

    CONSTRAINT chk_product_tenure
        CHECK (policy_tenure_months > 0)
);

CREATE INDEX idx_products_category
ON products(product_category);

CREATE INDEX idx_products_active
ON products(active);


CREATE TABLE policies (
    id BIGSERIAL PRIMARY KEY,
    policy_number VARCHAR(50) NOT NULL UNIQUE,

    user_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,

    nominee_name VARCHAR(150) NOT NULL,
    nominee_relationship VARCHAR(100) NOT NULL,

    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    premium_amount NUMERIC(15,2) NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    cancellation_requested BOOLEAN NOT NULL DEFAULT FALSE,

    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_policy_user
        FOREIGN KEY (user_id)
        REFERENCES users(id),

    CONSTRAINT fk_policy_product
        FOREIGN KEY (product_id)
        REFERENCES products(id),

    CONSTRAINT chk_policy_dates
        CHECK (end_date >= start_date),

    CONSTRAINT chk_policy_status
        CHECK (
            status IN (
                'ACTIVE',
                'EXPIRED',
                'CANCEL_PENDING',
                'CANCELLED'
            )
        )
);

CREATE INDEX idx_policies_user
ON policies(user_id);

CREATE INDEX idx_policies_product
ON policies(product_id);

CREATE INDEX idx_policies_status
ON policies(status);

INSERT INTO products
(product_name, product_category, coverage_amount, premium_amount, policy_tenure_months)
VALUES
('Smart Health Protect', 'HEALTH', 500000.00, 12000.00, 12),

('Smart Motor Protect', 'MOTOR', 800000.00, 15000.00, 12),

('Smart Life Protect', 'LIFE', 2500000.00, 30000.00, 12),

('Smart Travel Protect', 'TRAVEL', 300000.00, 5000.00, 6);