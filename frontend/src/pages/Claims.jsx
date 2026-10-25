import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  FileText,
  IndianRupee,
  Plus,
  X,
} from "lucide-react";
import apiClient from "../api/apiClient";

const initialClaim = {
  policyNumber: "",
  claimType: "ACCIDENT",
  incidentDate: "",
  claimAmount: "",
  description: "",
};

export default function Claims() {
  const [claims, setClaims] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [form, setForm] = useState(initialClaim);
  const [showClaimForm, setShowClaimForm] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadData = async () => {
    try {
      const [claimResult, policyResult] =
        await Promise.all([
          apiClient.get("/claims/my"),
          apiClient.get("/policies/my"),
        ]);

      setClaims(claimResult.data);

      setPolicies(
        policyResult.data.filter(
          (policy) =>
            policy.status === "ACTIVE"
        )
      );
    } catch {
      setError("Unable to load claim information.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const submitClaim = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiClient.post(
        "/claims",
        {
          ...form,
          claimAmount: Number(form.claimAmount),
        }
      );

      setMessage(
        `Claim ${response.data.claimNumber} submitted successfully.`
      );

      setForm(initialClaim);
      setShowClaimForm(false);

      await loadData();
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.error ||
          (data &&
          typeof data === "object"
            ? Object.values(data)[0]
            : null) ||
          "Unable to submit claim."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">
            CLAIM TRACKING
          </span>

          <h1>My claims</h1>

          <p>
            Submit and track insurance claims from
            one place.
          </p>
        </div>

        <button
          className="primary-button page-action-button"
          onClick={() => {
            setShowClaimForm(true);
            setMessage("");
            setError("");
          }}
        >
          <Plus size={16} />
          New claim
        </button>
      </div>

      {message && (
        <div className="success-alert">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

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
                <th>Policy</th>
                <th>Type</th>
                <th>Incident</th>
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
                      <FileText size={16} />

                      <strong>
                        {claim.claimNumber}
                      </strong>
                    </div>

                    <span className="table-subtext">
                      {claim.productName}
                    </span>
                  </td>

                  <td>{claim.policyNumber}</td>

                  <td>{claim.claimType}</td>

                  <td>
                    <span className="inline-info">
                      <CalendarDays size={14} />
                      {claim.incidentDate}
                    </span>
                  </td>

                  <td>
                    <span className="inline-info">
                      <IndianRupee size={14} />

                      {Number(
                        claim.claimAmount
                      ).toLocaleString("en-IN")}
                    </span>
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

                  <td>
                    <Link
                      to={`/claims/${claim.claimNumber}`}
                      className="table-action"
                    >
                      View
                      <ArrowUpRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {claims.length === 0 && (
            <div className="empty-row">
              No claims submitted yet.
            </div>
          )}
        </div>
      </section>

      {showClaimForm && (
        <div className="modal-backdrop">
          <div className="action-modal">
            <button
              className="modal-close"
              onClick={() =>
                setShowClaimForm(false)
              }
            >
              <X size={18} />
            </button>

            <span className="eyebrow">
              NEW CLAIM
            </span>

            <h2>Submit insurance claim</h2>

            <p className="modal-intro">
              Provide details about the insured
              incident.
            </p>

            <form
              className="modal-form"
              onSubmit={submitClaim}
            >
              <label>
                Policy

                <select
                  name="policyNumber"
                  value={form.policyNumber}
                  onChange={updateField}
                  required
                >
                  <option value="">
                    Select active policy
                  </option>

                  {policies.map((policy) => (
                    <option
                      key={policy.policyNumber}
                      value={policy.policyNumber}
                    >
                      {policy.productName} ·{" "}
                      {policy.policyNumber}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Claim type

                <select
                  name="claimType"
                  value={form.claimType}
                  onChange={updateField}
                >
                  <option value="ACCIDENT">
                    Accident
                  </option>

                  <option value="MEDICAL">
                    Medical
                  </option>

                  <option value="DAMAGE">
                    Damage
                  </option>

                  <option value="THEFT">
                    Theft
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </label>

              <div className="modal-form-row">
                <label>
                  Incident date

                  <input
                    type="date"
                    name="incidentDate"
                    value={form.incidentDate}
                    onChange={updateField}
                    max={
                      new Date()
                        .toISOString()
                        .split("T")[0]
                    }
                    required
                  />
                </label>

                <label>
                  Claim amount

                  <input
                    type="number"
                    min="1"
                    name="claimAmount"
                    value={form.claimAmount}
                    onChange={updateField}
                    placeholder="250000"
                    required
                  />
                </label>
              </div>

              <label>
                Description

                <textarea
                  name="description"
                  value={form.description}
                  onChange={updateField}
                  placeholder="Describe what happened..."
                  required
                />
              </label>

              <button
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Submitting..."
                  : "Submit claim"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
