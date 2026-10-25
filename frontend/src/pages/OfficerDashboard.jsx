import { useEffect, useState } from "react";
import {
  ClipboardCheck,
  FileSearch,
  ShieldCheck,
} from "lucide-react";
import { Link } from "react-router-dom";
import apiClient from "../api/apiClient";

export default function OfficerDashboard() {
  const [claims, setClaims] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get("/officer/claims/queue")
      .then((response) => setClaims(response.data))
      .catch(() =>
        setError("Unable to load claim queue.")
      );
  }, []);

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          CLAIMS OPERATIONS
        </span>

        <h1>Claims Officer Dashboard</h1>

        <p>
          Review submitted claims and manage
          customer claim decisions.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="metric-grid officer-metrics">
        <article className="metric-card">
          <div className="metric-icon blue">
            <ClipboardCheck size={20} />
          </div>

          <div className="metric-copy">
            <span>Submitted Queue</span>
            <strong>{claims.length}</strong>
            <small>Claims awaiting review</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon teal">
            <FileSearch size={20} />
          </div>

          <div className="metric-copy">
            <span>Review Workspace</span>
            <strong>Live</strong>
            <small>Process customer claims</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon green">
            <ShieldCheck size={20} />
          </div>

          <div className="metric-copy">
            <span>Secure Access</span>
            <strong>Officer</strong>
            <small>Role protected workflow</small>
          </div>
        </article>
      </section>

      <section className="panel officer-queue-preview">
        <div className="panel-header">
          <div>
            <h3>Claims awaiting review</h3>
            <p>
              Submitted claims currently in your queue
            </p>
          </div>

          <Link
            to="/officer/claims"
            className="table-action"
          >
            View full queue
          </Link>
        </div>

        {claims.length === 0 ? (
          <div className="empty-row">
            No submitted claims are waiting for review.
          </div>
        ) : (
          claims.slice(0, 5).map((claim) => (
            <div
              className="activity-row"
              key={claim.claimNumber}
            >
              <div className="activity-icon">
                <ClipboardCheck size={17} />
              </div>

              <div className="activity-main">
                <strong>{claim.claimNumber}</strong>
                <span>
                  {claim.productName} ·{" "}
                  {claim.claimType}
                </span>
              </div>

              <strong className="activity-amount">
                ₹
                {Number(
                  claim.claimAmount
                ).toLocaleString("en-IN")}
              </strong>

              <Link
                to={`/officer/claims/${claim.claimNumber}`}
                className="table-action"
              >
                Review
              </Link>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
