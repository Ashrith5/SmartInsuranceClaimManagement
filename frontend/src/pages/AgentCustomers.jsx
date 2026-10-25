import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function AgentCustomers() {
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
          CUSTOMER PORTFOLIO
        </span>

        <h1>Assigned customers</h1>

        <p>
          Review insurance activity for customers
          assigned to you.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="agent-customer-grid">
        {customers.map((customer) => (
          <article
            className="agent-customer-card"
            key={customer.customerId}
          >
            <div className="agent-card-top">
              <div className="agent-avatar large">
                {customer.firstName
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <h3>
                  {customer.firstName}{" "}
                  {customer.lastName}
                </h3>

                <span>
                  Customer #{customer.customerId}
                </span>
              </div>
            </div>

            <div className="agent-contact-list">
              <div>
                <Mail size={14} />
                {customer.email}
              </div>

              <div>
                <Phone size={14} />
                {customer.phone || "Not available"}
              </div>
            </div>

            <Link
              to={`/agent/customers/${customer.customerId}`}
              className="primary-button agent-view-button"
            >
              <UserRound size={15} />
              Customer overview
              <ArrowUpRight size={14} />
            </Link>
          </article>
        ))}

        {customers.length === 0 && (
          <div className="panel empty-row">
            No customers have been assigned yet.
          </div>
        )}
      </section>
    </div>
  );
}
