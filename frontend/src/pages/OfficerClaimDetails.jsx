import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  IndianRupee,
  MessageSquareText,
  PlayCircle,
  Scale,
  XCircle,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function OfficerClaimDetails() {
  const { claimNumber } = useParams();

  const [claim, setClaim] = useState(null);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);

  const [infoMessage, setInfoMessage] =
    useState("");

  const [decisionReason, setDecisionReason] =
    useState("");

  const [settlementAmount, setSettlementAmount] =
    useState("");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    setError("");

    try {
      const [
        claimResult,
        historyResult,
        documentsResult,
      ] = await Promise.all([
        apiClient.get(
          `/officer/claims/${claimNumber}`
        ),
        apiClient.get(
          `/officer/claims/${claimNumber}/history`
        ),
        apiClient.get(
          `/officer/claims/${claimNumber}/documents`
        ),
      ]);

      setClaim(claimResult.data);
      setHistory(historyResult.data);
      setDocuments(documentsResult.data);
    } catch {
      setError("Unable to load claim.");
    }
  };

  useEffect(() => {
    loadData();
  }, [claimNumber]);

  const startReview = async () => {
    setError("");
    setMessage("");

    try {
      await apiClient.post(
        `/officer/claims/${claimNumber}/start-review`
      );

      setMessage("Claim moved to review.");
      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to start review."
      );
    }
  };

  const requestInformation = async () => {
    if (!infoMessage.trim()) {
      setError(
        "Enter the information you need from the customer."
      );
      return;
    }

    try {
      await apiClient.post(
        `/officer/claims/${claimNumber}/request-information`,
        {
          message: infoMessage,
        }
      );

      setInfoMessage("");
      setMessage(
        "Information request sent to customer."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to request information."
      );
    }
  };

  const makeDecision = async (decision) => {
    if (!decisionReason.trim()) {
      setError("Enter a decision reason.");
      return;
    }

    try {
      await apiClient.post(
        `/officer/claims/${claimNumber}/${decision}`,
        {
          reason: decisionReason,
        }
      );

      setDecisionReason("");

      setMessage(
        decision === "approve"
          ? "Claim approved successfully."
          : "Claim rejected."
      );

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to process claim decision."
      );
    }
  };

  const settleClaim = async () => {
    if (!settlementAmount) {
      setError("Enter a settlement amount.");
      return;
    }

    try {
      await apiClient.post(
        `/officer/claims/${claimNumber}/settlement`,
        {
          settlementAmount: Number(
            settlementAmount
          ),
        }
      );

      setSettlementAmount("");
      setMessage("Claim settlement completed.");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to settle claim."
      );
    }
  };

  const downloadDocument = async (document) => {
    try {
      const response = await apiClient.get(
        `/officer/claims/${claimNumber}/documents/${document.id}/download`,
        {
          responseType: "blob",
        }
      );

      const url =
        window.URL.createObjectURL(
          new Blob([response.data])
        );

      const link =
        window.document.createElement("a");

      link.href = url;
      link.download = document.originalFileName;

      window.document.body.appendChild(link);
      link.click();
      link.remove();

      window.URL.revokeObjectURL(url);
    } catch {
      setError("Unable to download document.");
    }
  };

  if (!claim) {
    return (
      <div className="page">
        <div className="panel loading-panel">
          Loading claim review...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link
        to="/officer/claims"
        className="detail-back-link"
      >
        <ArrowLeft size={16} />
        Back to claim queue
      </Link>

      <div className="claim-detail-header">
        <div>
          <span className="eyebrow">
            CLAIM REVIEW
          </span>

          <h1>{claim.claimNumber}</h1>

          <p>
            {claim.productName} · {claim.claimType}
          </p>
        </div>

        <span
          className={`status-badge large-status ${claim.status
            .toLowerCase()
            .replaceAll("_", "-")}`}
        >
          {claim.status.replaceAll("_", " ")}
        </span>
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

      <section className="claim-summary-grid">
        <article className="claim-summary-card">
          <div className="claim-summary-icon">
            <IndianRupee size={19} />
          </div>

          <div>
            <span>Claim Amount</span>
            <strong>
              ₹
              {Number(
                claim.claimAmount
              ).toLocaleString("en-IN")}
            </strong>
          </div>
        </article>

        <article className="claim-summary-card">
          <div className="claim-summary-icon">
            <FileText size={19} />
          </div>

          <div>
            <span>Policy</span>
            <strong>{claim.policyNumber}</strong>
          </div>
        </article>

        <article className="claim-summary-card">
          <div className="claim-summary-icon">
            <Scale size={19} />
          </div>

          <div>
            <span>Claim Type</span>
            <strong>{claim.claimType}</strong>
          </div>
        </article>
      </section>

      <section className="officer-detail-grid">
        <div className="claim-detail-main">
          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Customer statement</h3>
                <p>
                  Description submitted with the claim
                </p>
              </div>
            </div>

            <p className="claim-description">
              {claim.description}
            </p>
          </div>

          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Supporting evidence</h3>
                <p>
                  Customer-uploaded claim documents
                </p>
              </div>
            </div>

            {documents.map((document) => (
              <div
                className="document-row"
                key={document.id}
              >
                <div className="document-icon">
                  <FileText size={18} />
                </div>

                <div className="document-copy">
                  <strong>
                    {document.originalFileName}
                  </strong>

                  <span>
                    {document.documentType.replaceAll(
                      "_",
                      " "
                    )}
                  </span>
                </div>

                <button
                  className="download-button"
                  onClick={() =>
                    downloadDocument(document)
                  }
                >
                  <Download size={15} />
                  Download
                </button>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="empty-row">
                No supporting evidence uploaded.
              </div>
            )}
          </div>

          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Claim history</h3>
                <p>
                  Complete claim workflow audit
                </p>
              </div>
            </div>

            {history.map((item) => (
              <div
                className="officer-history-row"
                key={item.id}
              >
                <div className="history-dot" />

                <div>
                  <strong>
                    {item.previousStatus || "NEW"}{" "}
                    →{" "}
                    {item.newStatus.replaceAll(
                      "_",
                      " "
                    )}
                  </strong>

                  <p>{item.remarks}</p>

                  <span>
                    {item.changedByEmail} ·{" "}
                    {new Date(
                      item.changedAt
                    ).toLocaleString("en-IN")}
                  </span>
                </div>
              </div>
            ))}

            {history.length === 0 && (
              <div className="empty-row">
                No workflow history recorded yet.
              </div>
            )}
          </div>
        </div>

        <aside className="officer-actions">
          {claim.status === "SUBMITTED" && (
            <div className="panel officer-action-card">
              <div className="action-card-icon blue">
                <PlayCircle size={20} />
              </div>

              <h3>Begin claim review</h3>

              <p>
                Move this submitted claim into the
                review workflow.
              </p>

              <button
                className="primary-button"
                onClick={startReview}
              >
                Start review
              </button>
            </div>
          )}

          {claim.status === "UNDER_REVIEW" && (
            <>
              <div className="panel officer-action-card">
                <div className="action-card-icon amber">
                  <MessageSquareText size={20} />
                </div>

                <h3>Request information</h3>

                <p>
                  Ask the customer for additional
                  evidence or clarification.
                </p>

                <textarea
                  value={infoMessage}
                  onChange={(event) =>
                    setInfoMessage(
                      event.target.value
                    )
                  }
                  placeholder="What information is required?"
                />

                <button
                  className="secondary-action full-action"
                  onClick={requestInformation}
                >
                  Send request
                </button>
              </div>

              <div className="panel officer-action-card">
                <div className="action-card-icon green">
                  <Scale size={20} />
                </div>

                <h3>Claim decision</h3>

                <p>
                  Record the final review decision
                  and supporting reason.
                </p>

                <textarea
                  value={decisionReason}
                  onChange={(event) =>
                    setDecisionReason(
                      event.target.value
                    )
                  }
                  placeholder="Decision reason..."
                />

                <div className="decision-actions">
                  <button
                    className="approve-button"
                    onClick={() =>
                      makeDecision("approve")
                    }
                  >
                    <CheckCircle2 size={15} />
                    Approve
                  </button>

                  <button
                    className="reject-button"
                    onClick={() =>
                      makeDecision("reject")
                    }
                  >
                    <XCircle size={15} />
                    Reject
                  </button>
                </div>
              </div>
            </>
          )}

          {claim.status === "APPROVED" && (
            <div className="panel officer-action-card">
              <div className="action-card-icon green">
                <IndianRupee size={20} />
              </div>

              <h3>Settle approved claim</h3>

              <p>
                Settlement cannot exceed the approved
                claim amount.
              </p>

              <input
                type="number"
                min="1"
                max={claim.claimAmount}
                value={settlementAmount}
                onChange={(event) =>
                  setSettlementAmount(
                    event.target.value
                  )
                }
                placeholder="Settlement amount"
              />

              <button
                className="primary-button"
                onClick={settleClaim}
              >
                Complete settlement
              </button>
            </div>
          )}

          {(claim.status === "REJECTED" ||
            claim.status === "SETTLED") && (
            <div className="panel officer-action-card final-state-card">
              <CheckCircle2 size={25} />

              <h3>
                Claim workflow complete
              </h3>

              <p>
                This claim has reached its final
                processing status.
              </p>
            </div>
          )}
        </aside>
      </section>
    </div>
  );
}
