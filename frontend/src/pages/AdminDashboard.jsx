import { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  PackageSearch,
  ShieldCheck,
  Users,
  UsersRound,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apiClient from "../api/apiClient";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadDashboard() {
      try {
        const [userResult, reportResult] =
          await Promise.all([
            apiClient.get("/admin/users"),
            apiClient.get(
              "/admin/reports/claims/status-summary"
            ),
          ]);

        setUsers(userResult.data);
        setReports(reportResult.data);
      } catch {
        setError(
          "Unable to load administrator dashboard."
        );
      }
    }

    loadDashboard();
  }, []);

  const roleCount = useMemo(
    () => ({
      customers: users.filter(
        (user) => user.role === "CUSTOMER"
      ).length,

      agents: users.filter(
        (user) => user.role === "AGENT"
      ).length,

      officers: users.filter(
        (user) =>
          user.role === "CLAIMS_OFFICER"
      ).length,
    }),
    [users]
  );

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          ADMINISTRATION
        </span>

        <h1>Administrator Dashboard</h1>

        <p>
          Manage platform users, products, assignments
          and insurance operations.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="metric-grid">
        <article className="metric-card">
          <div className="metric-icon blue">
            <Users size={20} />
          </div>

          <div className="metric-copy">
            <span>Total Users</span>
            <strong>{users.length}</strong>
            <small>Registered platform accounts</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon teal">
            <ShieldCheck size={20} />
          </div>

          <div className="metric-copy">
            <span>Customers</span>
            <strong>{roleCount.customers}</strong>
            <small>Insurance customers</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon violet">
            <UsersRound size={20} />
          </div>

          <div className="metric-copy">
            <span>Agents</span>
            <strong>{roleCount.agents}</strong>
            <small>Customer relationship agents</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon green">
            <PackageSearch size={20} />
          </div>

          <div className="metric-copy">
            <span>Claims Officers</span>
            <strong>{roleCount.officers}</strong>
            <small>Claim review specialists</small>
          </div>
        </article>
      </section>

      <section className="admin-dashboard-grid">
        <div className="panel admin-chart-panel">
          <div className="panel-header">
            <div>
              <h3>Claim status overview</h3>

              <p>
                Live analytics from the PostgreSQL
                reporting view
              </p>
            </div>

            <BarChart3 size={19} />
          </div>

          <ResponsiveContainer
            width="100%"
            height={280}
          >
            <BarChart data={reports}>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#edf1f5"
              />

              <XAxis
                dataKey="status"
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />

              <YAxis
                allowDecimals={false}
                tick={{ fontSize: 9 }}
                axisLine={false}
                tickLine={false}
              />

              <Tooltip />

              <Bar
                dataKey="claimCount"
                fill="#2563eb"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel admin-summary-panel">
          <div className="panel-header">
            <div>
              <h3>Claim financial summary</h3>
              <p>Amounts grouped by claim status</p>
            </div>
          </div>

          {reports.map((report) => (
            <div
              className="admin-summary-row"
              key={report.status}
            >
              <div>
                <span
                  className={`status-badge ${report.status
                    .toLowerCase()
                    .replaceAll("_", "-")}`}
                >
                  {report.status.replaceAll("_", " ")}
                </span>

                <small>
                  {report.claimCount} claim
                  {report.claimCount === 1 ? "" : "s"}
                </small>
              </div>

              <strong>
                ₹
                {Number(
                  report.totalClaimAmount
                ).toLocaleString("en-IN")}
              </strong>
            </div>
          ))}

          {reports.length === 0 && (
            <div className="empty-row">
              No claim analytics available.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
