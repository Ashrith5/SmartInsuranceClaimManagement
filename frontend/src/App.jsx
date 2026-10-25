import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";

import ClaimDetails from "./pages/ClaimDetails";
import Claims from "./pages/Claims";
import CustomerDashboard from "./pages/CustomerDashboard";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
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
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route
            path="/dashboard"
            element={<CustomerDashboard />}
          />

          <Route path="/products" element={<Products />} />
          <Route path="/policies" element={<Policies />} />
          <Route path="/payments" element={<Payments />} />
          <Route path="/claims" element={<Claims />} />

          <Route
            path="/claims/:claimNumber"
            element={<ClaimDetails />}
          />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
