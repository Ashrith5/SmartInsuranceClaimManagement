import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import heroImage from "../assets/hero.png";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  password: "",
};

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] =
    useState(initialForm);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      const responseData =
        err.response?.data;

      if (
        responseData &&
        typeof responseData === "object"
      ) {
        setError(
          responseData.error ||
            Object.values(responseData)[0] ||
            "Unable to create account."
        );
      } else {
        setError(
          "Unable to create account."
        );
      }
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
            GET PROTECTED
          </span>

          <h1>
            Insurance designed around
            your life.
          </h1>

          <p>
            Discover products, manage policies and
            handle claims within one secure platform.
          </p>

          <div className="promo-points">
            <span>
              <CheckCircle2 size={18} />
              Health, motor, life and travel
            </span>

            <span>
              <CheckCircle2 size={18} />
              Easy premium payments
            </span>

            <span>
              <CheckCircle2 size={18} />
              Digital claim management
            </span>
          </div>
        </div>
      </section>

      <section className="auth-form-side register-side">
        <div className="auth-card">
          <Link
            to="/login"
            className="back-link"
          >
            <ArrowLeft size={16} />
            Back to sign in
          </Link>

          <div className="auth-heading">
            <span className="eyebrow">
              CREATE ACCOUNT
            </span>

            <h2>Start your SmartInsure journey</h2>

            <p>
              Create a customer account to explore
              products and manage your coverage.
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
            <div className="form-row">
              <label>
                First name

                <div className="input-shell">
                  <UserRound size={18} />

                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={updateField}
                    required
                  />
                </div>
              </label>

              <label>
                Last name

                <div className="input-shell">
                  <UserRound size={18} />

                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={updateField}
                    required
                  />
                </div>
              </label>
            </div>

            <label>
              Email address

              <div className="input-shell">
                <Mail size={18} />

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  required
                />
              </div>
            </label>

            <label>
              Phone number

              <div className="input-shell">
                <Phone size={18} />

                <input
                  name="phone"
                  value={form.phone}
                  onChange={updateField}
                />
              </div>
            </label>

            <label>
              Password

              <div className="input-shell">
                <LockKeyhole size={18} />

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={updateField}
                  minLength="8"
                  required
                />
              </div>
            </label>

            <p className="field-hint">
              Use at least 8 characters.
            </p>

            <button
              type="submit"
              className="primary-button auth-submit"
              disabled={loading}
            >
              {loading
                ? "Creating account..."
                : "Create account"}

              {!loading && (
                <ArrowRight size={18} />
              )}
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}
