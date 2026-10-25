import { NavLink } from "react-router-dom";
import {
  BarChart3,
  ClipboardCheck,
  FileText,
  LayoutDashboard,
  LogOut,
  PackageSearch,
  ShieldCheck,
  Users,
  UsersRound,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const menus = {
  CUSTOMER: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Insurance Products", path: "/products", icon: PackageSearch },
    { label: "My Policies", path: "/policies", icon: ShieldCheck },
    { label: "Payments", path: "/payments", icon: WalletCards },
    { label: "Claims", path: "/claims", icon: FileText },
  ],

  CLAIMS_OFFICER: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Claim Queue", path: "/officer/claims", icon: ClipboardCheck },
  ],

  AGENT: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Customers", path: "/agent/customers", icon: UsersRound },
  ],

  ADMIN: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Users", path: "/admin/users", icon: Users },
    { label: "Products", path: "/admin/products", icon: PackageSearch },
    { label: "Assignments", path: "/admin/assignments", icon: UsersRound },
    { label: "Reports", path: "/admin/reports", icon: BarChart3 },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();

  const items = menus[user?.role] || menus.CUSTOMER;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-mark">
          <ShieldCheck size={24} />
        </div>

        <div>
          <strong>SmartInsure</strong>
          <span>Claims Management</span>
        </div>
      </div>

      <div className="sidebar-section-label">
        WORKSPACE
      </div>

      <nav className="sidebar-nav">
        {items.map(({ label, path, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) =>
              isActive
                ? "nav-item active"
                : "nav-item"
            }
          >
            <Icon size={19} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-user">
          <div className="user-avatar">
            {user?.email?.charAt(0).toUpperCase()}
          </div>

          <div>
            <strong>{user?.email}</strong>
            <span>
              {user?.role?.replaceAll("_", " ")}
            </span>
          </div>
        </div>

        <button
          className="logout-button"
          onClick={logout}
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </aside>
  );
}
