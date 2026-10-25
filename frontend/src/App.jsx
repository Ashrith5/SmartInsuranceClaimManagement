import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import AdminAssignments from "./pages/AdminAssignments";
import AdminProducts from "./pages/AdminProducts";
import AdminReports from "./pages/AdminReports";
import AdminUsers from "./pages/AdminUsers";
import AgentCustomerDetails from "./pages/AgentCustomerDetails";
import AgentCustomers from "./pages/AgentCustomers";
import ClaimDetails from "./pages/ClaimDetails";
import Claims from "./pages/Claims";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
import OfficerClaimDetails from "./pages/OfficerClaimDetails";
import OfficerClaims from "./pages/OfficerClaims";
import Payments from "./pages/Payments";
import Policies from "./pages/Policies";
import Products from "./pages/Products";
import Register from "./pages/Register";

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route path="/login" element={<Login />} />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<Dashboard />}
          />

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["CUSTOMER"]}
              />
            }
          >
            <Route
              path="/products"
              element={<Products />}
            />

            <Route
              path="/policies"
              element={<Policies />}
            />

            <Route
              path="/payments"
              element={<Payments />}
            />

            <Route
              path="/claims"
              element={<Claims />}
            />

            <Route
              path="/claims/:claimNumber"
              element={<ClaimDetails />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={[
                  "CLAIMS_OFFICER",
                ]}
              />
            }
          >
            <Route
              path="/officer/claims"
              element={<OfficerClaims />}
            />

            <Route
              path="/officer/claims/:claimNumber"
              element={<OfficerClaimDetails />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["AGENT"]}
              />
            }
          >
            <Route
              path="/agent/customers"
              element={<AgentCustomers />}
            />

            <Route
              path="/agent/customers/:customerId"
              element={<AgentCustomerDetails />}
            />
          </Route>

          <Route
            element={
              <ProtectedRoute
                allowedRoles={["ADMIN"]}
              />
            }
          >
            <Route
              path="/admin/users"
              element={<AdminUsers />}
            />

            <Route
              path="/admin/products"
              element={<AdminProducts />}
            />

            <Route
              path="/admin/assignments"
              element={<AdminAssignments />}
            />

            <Route
              path="/admin/reports"
              element={<AdminReports />}
            />
          </Route>
        </Route>
      </Route>

      <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  );
}
