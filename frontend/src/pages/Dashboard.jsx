import AgentDashboard from "./AgentDashboard";
import AdminDashboard from "./AdminDashboard";
import CustomerDashboard from "./CustomerDashboard";
import OfficerDashboard from "./OfficerDashboard";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "CUSTOMER") {
    return <CustomerDashboard />;
  }

  if (user?.role === "CLAIMS_OFFICER") {
    return <OfficerDashboard />;
  }

  if (user?.role === "AGENT") {
    return <AgentDashboard />;
  }

  if (user?.role === "ADMIN") {
    return <AdminDashboard />;
  }

  return <CustomerDashboard />;
}
