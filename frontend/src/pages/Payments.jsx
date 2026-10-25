import { useEffect, useState } from "react";
import {
  CheckCircle2,
  CreditCard,
  Plus,
  ReceiptText,
  X,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [policies, setPolicies] = useState([]);

  const [showPayment, setShowPayment] = useState(false);
  const [policyNumber, setPolicyNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("UPI");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadData = async () => {
    try {
      const [paymentResult, policyResult] =
        await Promise.all([
          apiClient.get("/payments/my"),
          apiClient.get("/policies/my"),
        ]);

      setPayments(paymentResult.data);

      setPolicies(
        policyResult.data.filter(
          (policy) => policy.status !== "CANCELLED"
        )
      );
    } catch {
      setError("Unable to load payment information.");
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const makePayment = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiClient.post(
        "/payments",
        {
          policyNumber,
          paymentMethod,
        }
      );

      setMessage(
        `Payment ${response.data.transactionId} completed successfully.`
      );

      setShowPayment(false);
      setPolicyNumber("");

      await loadData();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to process payment."
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
            PAYMENT HISTORY
          </span>

          <h1>Premium payments</h1>

          <p>
            Make premium payments and review your transaction history.
          </p>
        </div>

        <button
          className="primary-button page-action-button"
          onClick={() => {
            setShowPayment(true);
            setMessage("");
            setError("");
          }}
        >
          <Plus size={16} />
          Pay premium
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

      <section className="payment-list">
        {payments.map((payment) => (
          <article
            className="payment-card"
            key={payment.transactionId}
          >
            <div className="payment-icon">
              <ReceiptText size={21} />
            </div>

            <div className="payment-main">
              <strong>
                {payment.transactionId}
              </strong>

              <span>
                Policy {payment.policyNumber}
              </span>
            </div>

            <div className="payment-method">
              <CreditCard size={15} />

              {payment.paymentMethod.replaceAll(
                "_",
                " "
              )}
            </div>

            <div className="payment-amount">
              <strong>
                ₹{Number(
                  payment.amount
                ).toLocaleString("en-IN")}
              </strong>

              <span>
                <CheckCircle2 size={13} />
                {payment.paymentStatus}
              </span>
            </div>
          </article>
        ))}

        {payments.length === 0 && (
          <div className="panel empty-row">
            No payment history available.
          </div>
        )}
      </section>

      {showPayment && (
        <div className="modal-backdrop">
          <div className="action-modal">
            <button
              className="modal-close"
              onClick={() =>
                setShowPayment(false)
              }
            >
              <X size={18} />
            </button>

            <span className="eyebrow">
              PREMIUM PAYMENT
            </span>

            <h2>Pay policy premium</h2>

            <p className="modal-intro">
              The premium amount is securely determined
              from your selected policy.
            </p>

            <form
              className="modal-form"
              onSubmit={makePayment}
            >
              <label>
                Policy

                <select
                  value={policyNumber}
                  onChange={(event) =>
                    setPolicyNumber(
                      event.target.value
                    )
                  }
                  required
                >
                  <option value="">
                    Select policy
                  </option>

                  {policies.map((policy) => (
                    <option
                      key={policy.policyNumber}
                      value={policy.policyNumber}
                    >
                      {policy.productName} ·{" "}
                      {policy.policyNumber} · ₹
                      {Number(
                        policy.premiumAmount
                      ).toLocaleString("en-IN")}
                    </option>
                  ))}
                </select>
              </label>

              <label>
                Payment method

                <select
                  value={paymentMethod}
                  onChange={(event) =>
                    setPaymentMethod(
                      event.target.value
                    )
                  }
                >
                  <option value="UPI">
                    UPI
                  </option>

                  <option value="CARD">
                    Card
                  </option>

                  <option value="NET_BANKING">
                    Net Banking
                  </option>
                </select>
              </label>

              <button
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Processing..."
                  : "Confirm payment"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
