import { useEffect, useMemo, useState } from "react";
import {
  Car,
  HeartPulse,
  Plane,
  Search,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import apiClient from "../api/apiClient";

const categoryIcons = {
  HEALTH: HeartPulse,
  MOTOR: Car,
  LIFE: ShieldCheck,
  TRAVEL: Plane,
};

export default function Products() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("ALL");
  const [selected, setSelected] = useState(null);

  const [nomineeName, setNomineeName] = useState("");
  const [nomineeRelationship, setNomineeRelationship] = useState("");

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    apiClient.get("/products")
      .then((response) => setProducts(response.data))
      .catch(() => setError("Unable to load insurance products."));
  }, []);

  const filtered = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory =
        category === "ALL" ||
        product.productCategory === category;

      const matchesSearch =
        product.productName
          .toLowerCase()
          .includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [products, search, category]);

  const purchase = async (event) => {
    event.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const response = await apiClient.post("/policies", {
        productId: selected.id,
        nomineeName,
        nomineeRelationship,
      });

      setMessage(
        `Policy ${response.data.policyNumber} purchased successfully.`
      );

      setSelected(null);
      setNomineeName("");
      setNomineeRelationship("");
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to purchase this policy."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">
            INSURANCE PRODUCTS
          </span>

          <h1>Find the right protection</h1>

          <p>
            Choose coverage that fits your insurance needs.
          </p>
        </div>

        <div className="search-control">
          <Search size={17} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search products"
          />
        </div>
      </div>

      {message && (
        <div className="success-alert">
          {message}
        </div>
      )}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <div className="filter-row">
        {["ALL", "HEALTH", "MOTOR", "LIFE", "TRAVEL"].map(
          (item) => (
            <button
              key={item}
              className={
                category === item
                  ? "filter-chip active"
                  : "filter-chip"
              }
              onClick={() => setCategory(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <section className="product-grid">
        {filtered.map((product) => {
          const Icon =
            categoryIcons[product.productCategory] ||
            Sparkles;

          return (
            <article
              className="product-card"
              key={product.id}
            >
              <div className="product-top">
                <div className="product-icon">
                  <Icon size={25} />
                </div>

                <span className="category-pill">
                  {product.productCategory}
                </span>
              </div>

              <h3>{product.productName}</h3>

              <p>
                Comprehensive protection with transparent
                pricing and benefits.
              </p>

              <div className="product-stats">
                <div>
                  <span>Coverage</span>
                  <strong>
                    ₹{Number(
                      product.coverageAmount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Premium</span>
                  <strong>
                    ₹{Number(
                      product.premiumAmount
                    ).toLocaleString("en-IN")}
                  </strong>
                </div>

                <div>
                  <span>Tenure</span>
                  <strong>
                    {product.policyTenureMonths} months
                  </strong>
                </div>
              </div>

              <button
                className="primary-button product-action"
                onClick={() => {
                  setSelected(product);
                  setMessage("");
                  setError("");
                }}
              >
                Buy this policy
              </button>
            </article>
          );
        })}
      </section>

      {selected && (
        <div className="modal-backdrop">
          <div className="action-modal">
            <button
              className="modal-close"
              onClick={() => setSelected(null)}
            >
              <X size={18} />
            </button>

            <span className="eyebrow">
              PURCHASE POLICY
            </span>

            <h2>{selected.productName}</h2>

            <p className="modal-intro">
              Complete nominee details to activate your
              insurance policy.
            </p>

            <div className="purchase-summary">
              <div>
                <span>Coverage</span>
                <strong>
                  ₹{Number(
                    selected.coverageAmount
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Premium</span>
                <strong>
                  ₹{Number(
                    selected.premiumAmount
                  ).toLocaleString("en-IN")}
                </strong>
              </div>
            </div>

            <form
              className="modal-form"
              onSubmit={purchase}
            >
              <label>
                Nominee name
                <input
                  value={nomineeName}
                  onChange={(event) =>
                    setNomineeName(event.target.value)
                  }
                  required
                />
              </label>

              <label>
                Relationship
                <input
                  value={nomineeRelationship}
                  onChange={(event) =>
                    setNomineeRelationship(
                      event.target.value
                    )
                  }
                  placeholder="Parent, Spouse, Child..."
                  required
                />
              </label>

              <button
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Purchasing..."
                  : "Confirm purchase"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
