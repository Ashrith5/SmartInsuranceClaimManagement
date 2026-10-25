import {
  Bell,
  ChevronDown,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="app-header">
      <div>
        <span className="header-kicker">
          SMART INSURANCE
        </span>
        <h2>Insurance Workspace</h2>
      </div>

      <div className="header-actions">
        <div className="header-search">
          <Search size={17} />
          <span>Search workspace</span>
        </div>

        <button
          className="header-icon-button"
          aria-label="Notifications"
        >
          <Bell size={19} />
          <span className="notification-dot" />
        </button>

        <div className="header-profile">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>
              {user?.email?.split("@")[0]}
            </strong>
            <span>
              {user?.role?.replaceAll("_", " ")}
            </span>
          </div>

          <ChevronDown size={15} />
        </div>
      </div>
    </header>
  );
}
