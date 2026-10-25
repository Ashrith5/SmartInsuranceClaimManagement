import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function AgentDashboard() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/agent/customers")
      .then((response) =>
        setCustomers(response.data)
      )
      .catch(() =>
        setError(
          "Unable to load assigned customers."
        )
      );
  }, []);

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          AGENT WORKSPACE
        </span>

        <h1>Agent Dashboard</h1>

        <p>
          Support assigned customers and review
          their insurance coverage and claims.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="metric-grid agent-metrics">
        <article className="metric-card">
          <div className="metric-icon blue">
            <UsersRound size={20} />
          </div>

          <div className="metric-copy">
            <span>Assigned Customers</span>
            <strong>{customers.length}</strong>
            <small>Active customer relationships</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon teal">
            <ShieldCheck size={20} />
          </div>

          <div className="metric-copy">
            <span>Customer Support</span>
            <strong>Active</strong>
            <small>Policy and claim visibility</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon violet">
            <UserRound size={20} />
          </div>

          <div className="metric-copy">
            <span>Agent Access</span>
            <strong>Secure</strong>
            <small>Assigned customers only</small>
          </div>
        </article>
      </section>

      <section className="panel agent-preview-panel">
        <div className="panel-header">
          <div>
            <h3>Assigned customers</h3>
            <p>
              Customers currently assigned to your
              portfolio
            </p>
          </div>

          <Link
            to="/agent/customers"
            className="table-action"
          >
            View all
          </Link>
        </div>

        {customers.length === 0 ? (
          <div className="empty-row">
            No customers are currently assigned.
          </div>
        ) : (
          customers.slice(0, 5).map((customer) => (
            <div
              className="agent-customer-row"
              key={customer.customerId}
            >
              <div className="agent-avatar">
                {customer.firstName
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div className="agent-customer-copy">
                <strong>
                  {customer.firstName}{" "}
                  {customer.lastName}
                </strong>

                <span>{customer.email}</span>
              </div>

              <span className="customer-phone">
                {customer.phone || "No phone"}
              </span>

              <Link
                className="table-action"
                to={`/agent/customers/${customer.customerId}`}
              >
                View customer
              </Link>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
