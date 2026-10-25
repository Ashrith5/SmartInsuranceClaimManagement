import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Mail,
  Phone,
  Power,
  Users,
} from "lucide-react";
import apiClient from "../api/apiClient";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadUsers = async () => {
    try {
      const response =
        await apiClient.get("/admin/users");

      setUsers(response.data);
    } catch {
      setError("Unable to load platform users.");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const updateStatus = async (user) => {
    setMessage("");
    setError("");

    try {
      await apiClient.patch(
        `/admin/users/${user.id}/status`,
        {
          enabled: !user.enabled,
        }
      );

      setMessage(
        user.enabled
          ? "User account disabled."
          : "User account enabled."
      );

      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to update user status."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-heading">
        <span className="eyebrow">
          USER MANAGEMENT
        </span>

        <h1>Platform users</h1>

        <p>
          Review registered users and control account
          access.
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

      <section className="panel data-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Account</th>
                <th />
              </tr>
            </thead>

            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="admin-user-cell">
                      <div className="agent-avatar">
                        {user.firstName
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <strong>
                          {user.firstName}{" "}
                          {user.lastName}
                        </strong>

                        <span>
                          User #{user.id}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td>
                    <div className="admin-contact">
                      <span>
                        <Mail size={13} />
                        {user.email}
                      </span>

                      <span>
                        <Phone size={13} />
                        {user.phone || "Not available"}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="role-badge">
                      {user.role.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td>
                    <span
                      className={
                        user.enabled
                          ? "status-badge active"
                          : "status-badge cancelled"
                      }
                    >
                      {user.enabled
                        ? "ENABLED"
                        : "DISABLED"}
                    </span>
                  </td>

                  <td>
                    <button
                      className={
                        user.enabled
                          ? "danger-action"
                          : "secondary-action"
                      }
                      onClick={() =>
                        updateStatus(user)
                      }
                    >
                      <Power size={13} />

                      {user.enabled
                        ? "Disable"
                        : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="empty-row">
              <Users size={22} />
              No users are available.
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
