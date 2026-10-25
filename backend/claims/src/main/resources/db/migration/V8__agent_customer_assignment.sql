CREATE TABLE agent_customer_assignments (
    id BIGSERIAL PRIMARY KEY,

    agent_id BIGINT NOT NULL,
    customer_id BIGINT NOT NULL,

    assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    active BOOLEAN NOT NULL DEFAULT TRUE,

    CONSTRAINT fk_assignment_agent
        FOREIGN KEY (agent_id)
        REFERENCES users(id),

    CONSTRAINT fk_assignment_customer
        FOREIGN KEY (customer_id)
        REFERENCES users(id),

    CONSTRAINT uq_agent_customer
        UNIQUE (agent_id, customer_id),

    CONSTRAINT chk_agent_not_customer
        CHECK (agent_id <> customer_id)
);

CREATE INDEX idx_assignment_agent
ON agent_customer_assignments(agent_id);

CREATE INDEX idx_assignment_customer
ON agent_customer_assignments(customer_id);

CREATE INDEX idx_assignment_active
ON agent_customer_assignments(active);