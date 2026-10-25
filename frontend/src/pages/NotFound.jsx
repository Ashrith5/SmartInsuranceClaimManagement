import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <main className="center-page">
      <div className="empty-state">
        <span className="error-code">404</span>
        <h1>Page not found</h1>

        <p>
          The page you are looking for does not exist.
        </p>

        <Link
          to="/dashboard"
          className="primary-button"
        >
          Return to dashboard
        </Link>
      </div>
    </main>
  );
}
