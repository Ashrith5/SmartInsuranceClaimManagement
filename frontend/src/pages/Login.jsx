import { useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.png";

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] =
    useState("test.customer@example.com");
  const [password, setPassword] =
    useState("Test@1234");

  const [showPassword, setShowPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to sign in. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <img
          src={heroImage}
          alt=""
          className="auth-hero-image"
        />

        <div className="auth-visual-overlay" />

        <div className="brand">
          <div className="brand-mark">
            <ShieldCheck size={26} />
          </div>

          <div>
            <strong>SmartInsure</strong>
            <span>Claims Management</span>
          </div>
        </div>

        <div className="auth-promo">
          <span className="promo-chip">
            SMARTER INSURANCE
          </span>

          <h1>
            Protection that feels
            simple, clear and secure.
          </h1>

          <p>
            Manage policies, payments and claims
            through one modern insurance experience.
          </p>

          <div className="promo-points">
            <span>
              <CheckCircle2 size={18} />
              Secure role-based access
            </span>

            <span>
              <CheckCircle2 size={18} />
              Transparent claim tracking
            </span>

            <span>
              <CheckCircle2 size={18} />
              Simple policy management
            </span>
          </div>
        </div>
      </section>

      <section className="auth-form-side">
        <div className="auth-card">
          <div className="auth-heading">
            <span className="eyebrow">
              WELCOME BACK
            </span>

            <h2>Sign in to SmartInsure</h2>

            <p>
              Enter your credentials to continue
              to your insurance workspace.
            </p>
          </div>

          {error && (
            <div className="alert error-alert">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="auth-form"
          >
            <label>
              Email address

              <div className="input-shell">
                <Mail size={18} />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="name@example.com"
                  required
                />
              </div>
            </label>

            <label>
              Password

              <div className="input-shell">
                <LockKeyhole size={18} />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={password}
                  onChange={(event) =>
                    setPassword(
                      event.target.value
                    )
                  }
                  placeholder="Enter password"
                  required
                />

                <button
                  type="button"
                  className="icon-button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </label>

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Signing in..."
                : "Sign in"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to SmartInsure?</span>
          </div>

          <Link
            to="/register"
            className="secondary-button full-button"
          >
            Create customer account
          </Link>

          <p className="security-note">
            <ShieldCheck size={15} />
            Protected with secure JWT authentication
          </p>
        </div>
      </section>
    </main>
  );
}
