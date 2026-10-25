import { useEffect, useMemo, useState } from "react";
import {
  FileCheck2,
  IndianRupee,
  ShieldCheck,
  WalletCards,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import apiClient from "../api/apiClient";

const COLORS = ["#2563eb", "#14b8a6", "#f59e0b", "#dc2626"];

export default function CustomerDashboard() {
  const [policies, setPolicies] = useState([]);
  const [claims, setClaims] = useState([]);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [policyRes, claimRes, paymentRes] =
          await Promise.all([
            apiClient.get("/policies/my"),
            apiClient.get("/claims/my"),
            apiClient.get("/payments/my"),
          ]);

        setPolicies(policyRes.data);
        setClaims(claimRes.data);
        setPayments(paymentRes.data);
      } catch {
        setError("Unable to load dashboard information.");
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  const totalPayments = useMemo(
    () =>
      payments.reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      ),
    [payments]
  );

  const activePolicies = policies.filter(
    (policy) => policy.status === "ACTIVE"
  ).length;

  const settledClaims = claims.filter(
    (claim) => claim.status === "SETTLED"
  ).length;

  const claimChart = useMemo(() => {
    const grouped = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(grouped).map(
      ([name, value]) => ({ name, value })
    );
  }, [claims]);

  if (loading) {
    return (
      <div className="page">
        <div className="panel loading-panel">
          Loading your insurance workspace...
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-heading">
        <div>
          <span className="eyebrow">CUSTOMER OVERVIEW</span>
          <h1>Welcome back</h1>
          <p>
            A clear view of your protection, claims and payments.
          </p>
        </div>
      </div>

      {error && (
        <div className="alert error-alert">{error}</div>
      )}

      <section className="metric-grid">
        <Metric
          icon={ShieldCheck}
          title="Active Policies"
          value={activePolicies}
          tone="blue"
        />

        <Metric
          icon={FileCheck2}
          title="Total Claims"
          value={claims.length}
          detail={`${settledClaims} settled`}
          tone="teal"
        />

        <Metric
          icon={WalletCards}
          title="Payments"
          value={payments.length}
          detail="Successful transactions"
          tone="violet"
        />

        <Metric
          icon={IndianRupee}
          title="Premium Paid"
          value={`₹${totalPayments.toLocaleString("en-IN")}`}
          detail="Recorded payments"
          tone="green"
        />
      </section>

      <section className="dashboard-grid">
        <div className="panel recent-panel">
          <div className="panel-header">
            <div>
              <h3>Recent claims</h3>
              <p>Your latest claim activity</p>
            </div>
          </div>

          {claims.length === 0 ? (
            <div className="empty-row">
              No claims submitted yet.
            </div>
          ) : (
            claims.slice(0, 5).map((claim) => (
              <div
                className="activity-row"
                key={claim.claimNumber}
              >
                <div className="activity-icon">
                  <FileCheck2 size={18} />
                </div>

                <div className="activity-main">
                  <strong>{claim.claimNumber}</strong>
                  <span>
                    {claim.productName} · {claim.claimType}
                  </span>
                </div>

                <strong className="activity-amount">
                  ₹{Number(claim.claimAmount).toLocaleString("en-IN")}
                </strong>

                <span
                  className={`status-badge ${claim.status
                    .toLowerCase()
                    .replaceAll("_", "-")}`}
                >
                  {claim.status.replaceAll("_", " ")}
                </span>
              </div>
            ))
          )}
        </div>

        <div className="panel chart-panel">
          <div className="panel-header">
            <div>
              <h3>Claim status</h3>
              <p>Distribution across your claims</p>
            </div>
          </div>

          {claimChart.length ? (
            <div className="donut-wrap">
              <ResponsiveContainer width="100%" height={230}>
                <PieChart>
                  <Pie
                    data={claimChart}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={62}
                    outerRadius={88}
                    paddingAngle={4}
                  >
                    {claimChart.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>

              <div className="chart-total">
                <strong>{claims.length}</strong>
                <span>Claims</span>
              </div>
            </div>
          ) : (
            <div className="empty-row">
              Claim analytics will appear here.
            </div>
          )}
        </div>
      </section>

      <section className="panel policy-panel">
        <div className="panel-header">
          <div>
            <h3>Policy portfolio</h3>
            <p>Your current insurance coverage</p>
          </div>
        </div>

        <div className="compact-card-grid">
          {policies.slice(0, 4).map((policy) => (
            <div
              className="compact-policy-card"
              key={policy.policyNumber}
            >
              <div className="policy-icon">
                <ShieldCheck size={20} />
              </div>

              <div>
                <strong>{policy.productName}</strong>
                <span>{policy.policyNumber}</span>
              </div>

              <span
                className={`status-badge ${policy.status
                  .toLowerCase()
                  .replaceAll("_", "-")}`}
              >
                {policy.status.replaceAll("_", " ")}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function Metric({
  icon: Icon,
  title,
  value,
  detail,
  tone,
}) {
  return (
    <article className="metric-card">
      <div className={`metric-icon ${tone}`}>
        <Icon size={20} />
      </div>

      <div className="metric-copy">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{detail || "Current total"}</small>
      </div>
    </article>
  );
}
