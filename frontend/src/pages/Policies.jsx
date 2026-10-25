import { useEffect, useState } from "react";
import {
  CalendarDays,
  RefreshCcw,
  ShieldCheck,
  UserRound,
  XCircle,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function Policies() {
  const [policies, setPolicies] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadPolicies = async () => {
    try {
      const response =
        await apiClient.get("/policies/my");

      setPolicies(response.data);
    } catch {
      setError("Unable to load policies.");
    }
  };

  useEffect(() => {
    loadPolicies();
  }, []);

  const renew = async (policyNumber) => {
    setMessage("");
    setError("");

    try {
      await apiClient.post(
        `/policies/my/${policyNumber}/renew`
      );

      setMessage("Policy renewed successfully.");
      await loadPolicies();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to renew policy."
      );
    }
  };

  const cancel = async (policyNumber) => {
    const confirmed = window.confirm(
      "Request cancellation for this policy?"
    );

    if (!confirmed) return;

    setMessage("");
    setError("");

    try {
      await apiClient.post(
        `/policies/my/${policyNumber}/cancel`
      );

      setMessage(
        "Cancellation request submitted for admin approval."
      );

      await loadPolicies();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to request cancellation."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          MY COVERAGE
        </span>

        <h1>My policies</h1>

        <p>
          Manage coverage, renewal and policy cancellation.
        </p>
      </div>

      {message && (
        <div className="success-alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="record-grid">
        {policies.map((policy) => (
          <article
            className="record-card"
            key={policy.policyNumber}
          >
            <div className="record-card-head">
              <div className="record-title">
                <div className="policy-icon">
                  <ShieldCheck size={21} />
                </div>

                <div>
                  <h3>{policy.productName}</h3>
                  <span>{policy.policyNumber}</span>
                </div>
              </div>

              <span
                className={`status-badge ${policy.status
                  .toLowerCase()
                  .replaceAll("_", "-")}`}
              >
                {policy.status.replaceAll("_", " ")}
              </span>
            </div>

            <div className="record-details">
              <div>
                <CalendarDays size={16} />

                <span>
                  {policy.startDate} to {policy.endDate}
                </span>
              </div>

              <div>
                <UserRound size={16} />

                <span>
                  {policy.nomineeName} ·{" "}
                  {policy.nomineeRelationship}
                </span>
              </div>
            </div>

            <div className="record-money">
              <span>Premium amount</span>

              <strong>
                ₹{Number(
                  policy.premiumAmount
                ).toLocaleString("en-IN")}
              </strong>
            </div>

            {(policy.status === "ACTIVE" ||
              policy.status === "EXPIRED") && (
              <div className="policy-actions">
                <button
                  className="secondary-action"
                  onClick={() =>
                    renew(policy.policyNumber)
                  }
                >
                  <RefreshCcw size={14} />
                  Renew
                </button>

                <button
                  className="danger-action"
                  onClick={() =>
                    cancel(policy.policyNumber)
                  }
                >
                  <XCircle size={14} />
                  Request cancellation
                </button>
              </div>
            )}
          </article>
        ))}

        {policies.length === 0 && (
          <div className="panel empty-row">
            You do not have any policies yet.
          </div>
        )}
      </section>
    </div>
  );
}
