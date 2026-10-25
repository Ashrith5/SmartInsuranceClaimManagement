import {
  BadgeCheck,
  FileText,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";

const cards = [
  {
    icon: ShieldCheck,
    title: "Protection",
    text: "Manage your insurance coverage in one place.",
    color: "blue",
  },
  {
    icon: FileText,
    title: "Claims",
    text: "Submit and track claims with complete transparency.",
    color: "teal",
  },
  {
    icon: WalletCards,
    title: "Payments",
    text: "Review premium payments and transaction history.",
    color: "violet",
  },
  {
    icon: BadgeCheck,
    title: "Secure Access",
    text: "Role-based access keeps every workflow protected.",
    color: "green",
  },
];

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <div className="page">
      <section className="hero-panel">
        <div>
          <span className="eyebrow">
            INSURANCE, SIMPLIFIED
          </span>

          <h1>Welcome to your insurance workspace</h1>

          <p>
            Policies, claims, payments and support,
            brought together in one secure experience.
          </p>
        </div>

        <div className="hero-role">
          <span>Signed in as</span>
          <strong>
            {user?.role?.replaceAll("_", " ")}
          </strong>
        </div>
      </section>

      <section className="feature-grid">
        {cards.map(({ icon: Icon, title, text, color }) => (
          <article
            key={title}
            className={`feature-card ${color}`}
          >
            <div className="feature-icon">
              <Icon size={22} />
            </div>

            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
    </div>
  );
}
