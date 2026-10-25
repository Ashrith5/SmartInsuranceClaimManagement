import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  ClipboardCheck,
  IndianRupee,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function OfficerClaims() {
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
          CLAIM REVIEW
        </span>

        <h1>Submitted claim queue</h1>

        <p>
          Review new customer claims in submission order.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="panel data-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Claim</th>
                <th>Product</th>
                <th>Policy</th>
                <th>Type</th>
                <th>Amount</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {claims.map((claim) => (
                <tr key={claim.claimNumber}>
                  <td>
                    <div className="table-primary">
                      <ClipboardCheck size={16} />
                      <strong>
                        {claim.claimNumber}
                      </strong>
                    </div>
                  </td>

                  <td>{claim.productName}</td>
                  <td>{claim.policyNumber}</td>
                  <td>{claim.claimType}</td>

                  <td>
                    <span className="inline-info">
                      <IndianRupee size={14} />
                      {Number(
                        claim.claimAmount
                      ).toLocaleString("en-IN")}
                    </span>
                  </td>

                  <td>
                    <span className="status-badge submitted">
                      {claim.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    <Link
                      className="table-action"
                      to={`/officer/claims/${claim.claimNumber}`}
                    >
                      Review
                      <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {claims.length === 0 && (
            <div className="empty-row">
              No submitted claims are currently
              waiting for review.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
