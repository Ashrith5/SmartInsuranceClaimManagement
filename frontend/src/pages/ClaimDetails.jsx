import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Download,
  FileText,
  IndianRupee,
  MessageSquareText,
  ShieldCheck,
  Upload,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function ClaimDetails() {
  const { claimNumber } = useParams();

  const [claim, setClaim] = useState(null);
  const [history, setHistory] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [infoRequests, setInfoRequests] = useState([]);
  const [settlement, setSettlement] = useState(null);

  const [documentType, setDocumentType] =
    useState("OTHER");

  const [file, setFile] = useState(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [infoResponse, setInfoResponse] = useState("");

  const loadDetails = async () => {
    setError("");

    try {
      const [
        claimResult,
        historyResult,
        documentsResult,
        infoResult,
      ] = await Promise.all([
        apiClient.get(`/claims/my/${claimNumber}`),
        apiClient.get(`/claims/my/${claimNumber}/history`),
        apiClient.get(`/claims/my/${claimNumber}/documents`),
        apiClient.get(
          `/claims/my/${claimNumber}/information-requests`
        ),
      ]);

      setClaim(claimResult.data);
      setHistory(historyResult.data);
      setDocuments(documentsResult.data);
      setInfoRequests(infoResult.data);

      try {
        const settlementResult =
          await apiClient.get(
            `/claims/my/${claimNumber}/settlement`
          );

        setSettlement(settlementResult.data);
      } catch {
        setSettlement(null);
      }
    } catch {
      setError("Unable to load claim details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDetails();
  }, [claimNumber]);

  const uploadDocument = async (event) => {
    event.preventDefault();

    if (!file) {
      setError("Please select a document.");
      return;
    }

    setUploading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();

      formData.append("documentType", documentType);
      formData.append("file", file);

      await apiClient.post(
        `/claims/my/${claimNumber}/documents`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setMessage("Document uploaded successfully.");
      setFile(null);

      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to upload document."
      );
    } finally {
      setUploading(false);
    }
  };

  const downloadDocument = async (document) => {
    try {
      const response = await apiClient.get(
        `/claims/my/${claimNumber}/documents/${document.id}/download`,
        {
          responseType: "blob",
        }
      );

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      );

      const link = window.document.createElement("a");

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

  const respondToInformation = async () => {
    if (!infoResponse.trim()) {
      setError("Please enter your response.");
      return;
    }

    try {
      await apiClient.post(
        `/claims/my/${claimNumber}/information-response`,
        {
          message: infoResponse,
        }
      );

      setInfoResponse("");
      setMessage("Information submitted successfully.");
      await loadDetails();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to submit information."
      );
    }
  };

  if (loading) {
    return (
      <div className="page">
        <div className="panel loading-panel">
          Loading claim details...
        </div>
      </div>
    );
  }

  if (!claim) {
    return (
      <div className="page">
        <div className="panel empty-row">
          Claim could not be found.
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <Link
        to="/claims"
        className="detail-back-link"
      >
        <ArrowLeft size={16} />
        Back to claims
      </Link>

      <div className="claim-detail-header">
        <div>
          <span className="eyebrow">
            CLAIM DETAILS
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

      {error && (
        <div className="alert error-alert">{error}</div>
      )}

      {message && (
        <div className="success-alert">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      <section className="claim-summary-grid">
        <SummaryCard
          icon={ShieldCheck}
          label="Policy"
          value={claim.policyNumber}
        />

        <SummaryCard
          icon={IndianRupee}
          label="Claim Amount"
          value={`₹${Number(
            claim.claimAmount
          ).toLocaleString("en-IN")}`}
        />

        <SummaryCard
          icon={CalendarDays}
          label="Incident Date"
          value={claim.incidentDate}
        />

        <SummaryCard
          icon={Clock3}
          label="Submitted"
          value={
            claim.submittedAt
              ? new Date(
                  claim.submittedAt
                ).toLocaleDateString("en-IN")
              : "-"
          }
        />
      </section>

      <section className="claim-detail-grid">
        <div className="claim-detail-main">
          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Claim description</h3>
                <p>Information submitted with this claim</p>
              </div>
            </div>

            <p className="claim-description">
              {claim.description}
            </p>

            {claim.decisionReason && (
              <div className="decision-box">
                <strong>Decision note</strong>
                <p>{claim.decisionReason}</p>
              </div>
            )}
          </div>

          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Claim timeline</h3>
                <p>
                  Status changes recorded for this claim
                </p>
              </div>
            </div>

            {history.length === 0 ? (
              <div className="empty-row">
                No timeline activity recorded yet.
              </div>
            ) : (
              <div className="timeline">
                {history.map((item) => (
                  <div
                    className="timeline-item"
                    key={item.id}
                  >
                    <div className="timeline-marker">
                      <CheckCircle2 size={15} />
                    </div>

                    <div className="timeline-copy">
                      <div>
                        <strong>
                          {item.newStatus.replaceAll(
                            "_",
                            " "
                          )}
                        </strong>

                        <span>
                          {new Date(
                            item.changedAt
                          ).toLocaleString("en-IN")}
                        </span>
                      </div>

                      <p>{item.remarks}</p>

                      <small>
                        {item.action.replaceAll("_", " ")}
                      </small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Supporting documents</h3>
                <p>
                  Evidence attached to this claim
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
                    )}{" "}
                    ·{" "}
                    {Math.max(
                      1,
                      Math.round(
                        document.fileSize / 1024
                      )
                    )}{" "}
                    KB
                  </span>
                </div>

                <button
                  className="download-button"
                  onClick={() =>
                    downloadDocument(document)
                  }
                >
                  <Download size={16} />
                  Download
                </button>
              </div>
            ))}

            {documents.length === 0 && (
              <div className="empty-row">
                No supporting documents uploaded yet.
              </div>
            )}
          </div>

          <div className="panel detail-panel">
            <div className="panel-header">
              <div>
                <h3>Information requests</h3>
                <p>
                  Additional information requested during review
                </p>
              </div>
            </div>

            {infoRequests.map((request) => (
              <div
                className="info-request-card"
                key={request.id}
              >
                <MessageSquareText size={18} />

                <div>
                  <strong>
                    {request.requestMessage}
                  </strong>

                  <p>
                    {request.customerResponse ||
                      "Awaiting your response"}
                  </p>

                  <span
                    className={`status-badge ${request.status.toLowerCase()}`}
                  >
                    {request.status}
                  </span>

                  {request.status === "OPEN" && (
                    <div className="info-response-box">
                      <textarea
                        value={infoResponse}
                        onChange={(event) =>
                          setInfoResponse(
                            event.target.value
                          )
                        }
                        placeholder="Enter your response..."
                      />

                      <button
                        className="secondary-action"
                        onClick={respondToInformation}
                      >
                        Submit response
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {infoRequests.length === 0 && (
              <div className="empty-row">
                No information requests for this claim.
              </div>
            )}
          </div>
        </div>

        <aside className="claim-detail-side">
          <div className="panel upload-panel">
            <div className="panel-header">
              <div>
                <h3>Upload evidence</h3>
                <p>
                  PDF, JPEG or PNG · Maximum 10 MB
                </p>
              </div>
            </div>

            <form
              onSubmit={uploadDocument}
              className="upload-form"
            >
              <label>
                Document type

                <select
                  value={documentType}
                  onChange={(event) =>
                    setDocumentType(
                      event.target.value
                    )
                  }
                >
                  <option value="POLICE_REPORT">
                    Police Report
                  </option>

                  <option value="MEDICAL_REPORT">
                    Medical Report
                  </option>

                  <option value="DAMAGE_PHOTO">
                    Damage Photo
                  </option>

                  <option value="INVOICE">
                    Invoice
                  </option>

                  <option value="OTHER">
                    Other
                  </option>
                </select>
              </label>

              <label className="file-drop">
                <Upload size={22} />

                <strong>
                  {file
                    ? file.name
                    : "Choose document"}
                </strong>

                <span>
                  Click to select a supporting file
                </span>

                <input
                  type="file"
                  accept=".pdf,.jpg,.jpeg,.png"
                  onChange={(event) =>
                    setFile(
                      event.target.files?.[0] ||
                        null
                    )
                  }
                />
              </label>

              <button
                type="submit"
                className="primary-button"
                disabled={uploading}
              >
                <Upload size={16} />
                {uploading
                  ? "Uploading..."
                  : "Upload evidence"}
              </button>
            </form>
          </div>

          <div className="panel settlement-panel">
            <div className="panel-header">
              <div>
                <h3>Settlement</h3>
                <p>Final claim payment details</p>
              </div>
            </div>

            {settlement ? (
              <>
                <div className="settlement-success">
                  <CheckCircle2 size={22} />
                  <div>
                    <strong>
                      {settlement.settlementStatus}
                    </strong>
                    <span>
                      {settlement.settlementNumber}
                    </span>
                  </div>
                </div>

                <div className="settlement-amount">
                  <span>Settlement amount</span>
                  <strong>
                    ₹
                    {Number(
                      settlement.settlementAmount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div className="settlement-reference">
                  <span>Payment reference</span>
                  <strong>
                    {settlement.paymentReference}
                  </strong>
                </div>
              </>
            ) : (
              <div className="empty-row">
                Settlement is not available for this claim.
              </div>
            )}
          </div>
        </aside>
      </section>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <article className="claim-summary-card">
      <div className="claim-summary-icon">
        <Icon size={19} />
      </div>

      <div>
        <span>{label}</span>
        <strong>{value}</strong>
      </div>
    </article>
  );
}

