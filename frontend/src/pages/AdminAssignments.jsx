import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  ShieldCheck,
  UserRound,
  UsersRound,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function AdminAssignments() {
  const [users, setUsers] = useState([]);

  const [agentId, setAgentId] =
    useState("");

  const [customerId, setCustomerId] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  useEffect(() => {
    apiClient
      .get("/admin/users")
      .then((response) =>
        setUsers(response.data)
      )
      .catch(() =>
        setError(
          "Unable to load agents and customers."
        )
      );
  }, []);

  const agents = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "AGENT" &&
          user.enabled
      ),
    [users]
  );

  const customers = useMemo(
    () =>
      users.filter(
        (user) =>
          user.role === "CUSTOMER" &&
          user.enabled
      ),
    [users]
  );

  const selectedAgent = agents.find(
    (user) =>
      String(user.id) === String(agentId)
  );

  const selectedCustomer = customers.find(
    (user) =>
      String(user.id) ===
      String(customerId)
  );

  const assignCustomer = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      await apiClient.post(
        "/admin/agent-assignments",
        {
          agentId: Number(agentId),
          customerId: Number(customerId),
        }
      );

      setMessage(
        `${
          selectedCustomer?.firstName ||
          "Customer"
        } assigned to ${
          selectedAgent?.firstName ||
          "agent"
        } successfully.`
      );

      setAgentId("");
      setCustomerId("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to assign customer."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          AGENT ASSIGNMENTS
        </span>

        <h1>Assign customers to agents</h1>

        <p>
          Create secure customer-agent
          relationships for insurance support.
        </p>
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

      <section className="assignment-layout">
        <div className="panel assignment-form-panel">
          <div className="panel-header">
            <div>
              <h3>New assignment</h3>

              <p>
                Select one active agent and one
                active customer
              </p>
            </div>
          </div>

          <form
            className="assignment-form"
            onSubmit={assignCustomer}
          >
            <label>
              Agent

              <select
                value={agentId}
                onChange={(event) =>
                  setAgentId(
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Select agent
                </option>

                {agents.map((agent) => (
                  <option
                    key={agent.id}
                    value={agent.id}
                  >
                    {agent.firstName}{" "}
                    {agent.lastName} ·{" "}
                    {agent.email}
                  </option>
                ))}
              </select>
            </label>

            <div className="assignment-arrow">
              <UsersRound size={23} />
            </div>

            <label>
              Customer

              <select
                value={customerId}
                onChange={(event) =>
                  setCustomerId(
                    event.target.value
                  )
                }
                required
              >
                <option value="">
                  Select customer
                </option>

                {customers.map((customer) => (
                  <option
                    key={customer.id}
                    value={customer.id}
                  >
                    {customer.firstName}{" "}
                    {customer.lastName} ·{" "}
                    {customer.email}
                  </option>
                ))}
              </select>
            </label>

            <button
              className="primary-button"
              disabled={loading}
            >
              <UsersRound size={16} />

              {loading
                ? "Assigning..."
                : "Create assignment"}
            </button>
          </form>
        </div>

        <aside className="assignment-summary">
          <div className="panel assignment-stat-card">
            <div className="assignment-stat-icon blue">
              <UserRound size={21} />
            </div>

            <div>
              <span>Available Agents</span>
              <strong>{agents.length}</strong>
            </div>
          </div>

          <div className="panel assignment-stat-card">
            <div className="assignment-stat-icon teal">
              <ShieldCheck size={21} />
            </div>

            <div>
              <span>
                Available Customers
              </span>

              <strong>
                {customers.length}
              </strong>
            </div>
          </div>

          <div className="panel assignment-note">
            <UsersRound size={23} />

            <h3>
              Assignment access
            </h3>

            <p>
              Agents can view policies and claims
              only for customers actively assigned
              to the agent.
            </p>
          </div>
        </aside>
      </section>
    </div>
  );
}
