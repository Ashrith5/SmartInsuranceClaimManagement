import { useEffect, useMemo, useState } from "react";
import {
  Activity,
  BarChart3,
  FileCheck2,
  IndianRupee,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import apiClient from "../api/apiClient";

export default function AdminReports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient
      .get(
        "/admin/reports/claims/status-summary"
      )
      .then((response) =>
        setReports(response.data)
      )
      .catch(() =>
        setError("Unable to load claim reports.")
      );
  }, []);

  const totals = useMemo(
    () => ({
      count: reports.reduce(
        (sum, report) =>
          sum + Number(report.claimCount || 0),
        0
      ),

      amount: reports.reduce(
        (sum, report) =>
          sum +
          Number(
            report.totalClaimAmount || 0
          ),
        0
      ),
    }),
    [reports]
  );

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          REPORTING AND ANALYTICS
        </span>

        <h1>Insurance reports</h1>

        <p>
          Claim analytics generated from PostgreSQL
          reporting views and aggregations.
        </p>
      </div>

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="metric-grid admin-report-metrics">
        <article className="metric-card">
          <div className="metric-icon blue">
            <FileCheck2 size={20} />
          </div>

          <div className="metric-copy">
            <span>Total Claims</span>
            <strong>{totals.count}</strong>
            <small>Across all statuses</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon green">
            <IndianRupee size={20} />
          </div>

          <div className="metric-copy">
            <span>Total Claim Value</span>

            <strong>
              ₹
              {totals.amount.toLocaleString(
                "en-IN"
              )}
            </strong>

            <small>Recorded claim amounts</small>
          </div>
        </article>

        <article className="metric-card">
          <div className="metric-icon violet">
            <Activity size={20} />
          </div>

          <div className="metric-copy">
            <span>Status Categories</span>
            <strong>{reports.length}</strong>
            <small>Current workflow outcomes</small>
          </div>
        </article>
      </section>

      <section className="panel report-chart-panel">
        <div className="panel-header">
          <div>
            <h3>Claim value by status</h3>

            <p>
              Total and average claim amount across
              workflow statuses
            </p>
          </div>

          <BarChart3 size={19} />
        </div>

        <ResponsiveContainer
          width="100%"
          height={360}
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
              tick={{ fontSize: 9 }}
              axisLine={false}
              tickLine={false}
            />

            <Tooltip />
            <Legend />

            <Bar
              name="Total Amount"
              dataKey="totalClaimAmount"
              fill="#2563eb"
              radius={[6, 6, 0, 0]}
            />

            <Bar
              name="Average Amount"
              dataKey="averageClaimAmount"
              fill="#14b8a6"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="panel report-table-panel">
        <div className="panel-header">
          <div>
            <h3>Claim status details</h3>
            <p>Aggregated operational report</p>
          </div>
        </div>

        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Claims</th>
                <th>Total Amount</th>
                <th>Average Amount</th>
              </tr>
            </thead>

            <tbody>
              {reports.map((report) => (
                <tr key={report.status}>
                  <td>
                    <span
                      className={`status-badge ${report.status
                        .toLowerCase()
                        .replaceAll("_", "-")}`}
                    >
                      {report.status.replaceAll(
                        "_",
                        " "
                      )}
                    </span>
                  </td>

                  <td>{report.claimCount}</td>

                  <td>
                    ₹
                    {Number(
                      report.totalClaimAmount
                    ).toLocaleString("en-IN")}
                  </td>

                  <td>
                    ₹
                    {Number(
                      report.averageClaimAmount
                    ).toLocaleString("en-IN")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
