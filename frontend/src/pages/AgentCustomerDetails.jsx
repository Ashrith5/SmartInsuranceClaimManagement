import { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  IndianRupee,
  ShieldCheck,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function AgentCustomerDetails() {
  const { customerId } = useParams();

  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadCustomer() {
      try {
        const [policyResult, claimResult] =
          await Promise.all([
            apiClient.get(
              `/agent/customers/${customerId}/policies`
            ),
            apiClient.get(
              `/agent/customers/${customerId}/claims`
            ),
          ]);

        setPolicies(policyResult.data);
        setClaims(claimResult.data);
      } catch (err) {
        setError(
          err.response?.data?.error ||
            "Unable to load customer information."
        );
      }
    }

    loadCustomer();
  }, [customerId]);

  return (
    <div className="page">
      <Link
        to="/agent/customers"
        className="detail-back-link"
      >
        <ArrowLeft size={16} />
        Back to customers
      </Link>

      <div className="page-heading">
        <span className="eyebrow">
          CUSTOMER OVERVIEW
        </span>

        <h1>Customer #{customerId}</h1>

        <p>
          Insurance policies and claims visible to
          the assigned agent.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="metric-grid agent-detail-metrics">
        <article className="metric-card">
          <div className="metric-icon blue">
            <ShieldCheck size={20} />
          </div>

          <div className="metric-copy">
            <span>Policies</span>
            <strong>{policies.length}</strong>
            <small>Total customer coverage</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon teal">
            <FileText size={20} />
          </div>

          <div className="metric-copy">
            <span>Claims</span>
            <strong>{claims.length}</strong>
            <small>Customer claim records</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon green">
            <IndianRupee size={20} />
          </div>

          <div className="metric-copy">
            <span>Total Premium</span>

            <strong>
              ₹
              {policies
                .reduce(
                  (sum, policy) =>
                    sum +
                    Number(
                      policy.premiumAmount || 0
                    ),
                  0
                )
                .toLocaleString("en-IN")}
            </strong>

            <small>Across customer policies</small>
          </div>
        </article>
      </section>

      <section className="panel agent-detail-panel">
        <div className="panel-header">
          <div>
            <h3>Customer policies</h3>
            <p>
              Current and historical insurance policies
            </p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Policy</th>
                <th>Product</th>
                <th>Premium</th>
                <th>Coverage Period</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {policies.map((policy) => (
                <tr key={policy.policyNumber}>
                  <td>
                    <strong>
                      {policy.policyNumber}
                    </strong>
                  </td>

                  <td>{policy.productName}</td>

                  <td>
                    ₹
                    {Number(
                      policy.premiumAmount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    {policy.startDate} to{" "}
                    {policy.endDate}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${policy.status
                        .toLowerCase()
                        .replaceAll("_", "-")}`}
                    >
                      {policy.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {policies.length === 0 && (
            <div className="empty-row">
              Customer has no policies.
            </div>
          )}
        </div>
      </section>

      <section className="panel agent-detail-panel">
        <div className="panel-header">
          <div>
            <h3>Customer claims</h3>
            <p>
              Claim activity across assigned policies
            </p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimNumber}>
                  <td>
                    <div className="table-primary">
                      <FileText size={15} />

                      <strong>
                        {claim.claimNumber}
                      </strong>
                    </div>
                  </td>

                  <td>{claim.policyNumber}</td>
                  <td>{claim.claimType}</td>

                  <td>
                    ₹
                    {Number(
                      claim.claimAmount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    <span
                      className={`status-badge ${claim.status
                        .toLowerCase()
                        .replaceAll("_", "-")}`}
                    >
                      {claim.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {claims.length === 0 && (
            <div className="empty-row">
              Customer has no claims.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
