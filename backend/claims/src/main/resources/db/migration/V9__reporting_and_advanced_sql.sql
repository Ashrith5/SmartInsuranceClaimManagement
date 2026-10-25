-- ============================================================
-- 1. REPORTING VIEW
-- Demonstrates: VIEW, JOIN, GROUP BY, aggregate functions
-- ============================================================

CREATE VIEW vw_claim_status_summary AS
SELECT
    c.status,
    COUNT(*) AS claim_count,
    COALESCE(SUM(c.claim_amount), 0) AS total_claim_amount,
    COALESCE(AVG(c.claim_amount), 0) AS average_claim_amount
FROM claims c
GROUP BY c.status;


-- ============================================================
-- 2. PRODUCT / POLICY REPORTING VIEW
-- Demonstrates: JOIN, GROUP BY, ORDER BY-ready aggregate data
-- ============================================================

CREATE VIEW vw_product_policy_summary AS
SELECT
    pr.id AS product_id,
    pr.product_name,
    pr.product_category,
    COUNT(p.id) AS policies_sold,
    COALESCE(SUM(p.premium_amount), 0) AS total_premium_value
FROM products pr
LEFT JOIN policies p
    ON p.product_id = pr.id
GROUP BY
    pr.id,
    pr.product_name,
    pr.product_category;


-- ============================================================
-- 3. PAYMENT REPORTING VIEW
-- ============================================================

CREATE VIEW vw_payment_summary AS
SELECT
    payment_method,
    payment_status,
    COUNT(*) AS transaction_count,
    COALESCE(SUM(amount), 0) AS total_amount
FROM payments
GROUP BY
    payment_method,
    payment_status;


-- ============================================================
-- 4. STORED FUNCTION
-- Demonstrates PostgreSQL function
-- ============================================================

CREATE OR REPLACE FUNCTION fn_customer_total_claim_amount(
    p_customer_id BIGINT
)
RETURNS NUMERIC
LANGUAGE SQL
AS $$
    SELECT COALESCE(SUM(claim_amount), 0)
    FROM claims
    WHERE user_id = p_customer_id;
$$;


-- ============================================================
-- 5. CTE + WINDOW FUNCTION VIEW
-- Demonstrates CTE, PARTITION BY, ROW_NUMBER
-- ============================================================

CREATE VIEW vw_customer_claim_ranking AS
WITH ranked_claims AS (
    SELECT
        c.id,
        c.claim_number,
        c.user_id,
        c.claim_amount,
        c.status,
        c.submitted_at,

        ROW_NUMBER() OVER (
            PARTITION BY c.user_id
            ORDER BY c.claim_amount DESC
        ) AS claim_rank

    FROM claims c
)
SELECT
    id,
    claim_number,
    user_id,
    claim_amount,
    status,
    submitted_at,
    claim_rank
FROM ranked_claims;


-- ============================================================
-- 6. ADDITIONAL REPORTING INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_claims_status_amount
ON claims(status, claim_amount);

CREATE INDEX IF NOT EXISTS idx_payments_method_status
ON payments(payment_method, payment_status);

CREATE INDEX IF NOT EXISTS idx_policies_user_status
ON policies(user_id, status);