import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Edit3,
  PackagePlus,
  PackageSearch,
  Power,
  X,
} from "lucide-react";
import apiClient from "../api/apiClient";

const emptyForm = {
  productName: "",
  productCategory: "HEALTH",
  coverageAmount: "",
  premiumAmount: "",
  policyTenureMonths: "12",
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [inactiveProducts, setInactiveProducts] =
    useState([]);

  const [form, setForm] = useState(emptyForm);
  const [editingProduct, setEditingProduct] =
    useState(null);

  const [showModal, setShowModal] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  const loadProducts = async () => {
    try {
      const response =
        await apiClient.get("/products");

      setProducts(
        response.data.map((product) => ({
          ...product,
          active: true,
        }))
      );
    } catch {
      setError(
        "Unable to load insurance products."
      );
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const updateField = (event) => {
    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });
  };

  const openCreateModal = () => {
    setEditingProduct(null);
    setForm(emptyForm);
    setShowModal(true);
    setMessage("");
    setError("");
  };

  const openEditModal = (product) => {
    setEditingProduct(product);

    setForm({
      productName: product.productName,
      productCategory:
        product.productCategory,
      coverageAmount:
        product.coverageAmount,
      premiumAmount:
        product.premiumAmount,
      policyTenureMonths:
        product.policyTenureMonths,
    });

    setShowModal(true);
    setMessage("");
    setError("");
  };

  const saveProduct = async (event) => {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    const payload = {
      productName: form.productName,
      productCategory:
        form.productCategory,
      coverageAmount:
        Number(form.coverageAmount),
      premiumAmount:
        Number(form.premiumAmount),
      policyTenureMonths:
        Number(form.policyTenureMonths),
    };

    try {
      if (editingProduct) {
        await apiClient.put(
          `/admin/products/${editingProduct.id}`,
          payload
        );

        setMessage(
          "Insurance product updated successfully."
        );
      } else {
        await apiClient.post(
          "/admin/products",
          payload
        );

        setMessage(
          "Insurance product created successfully."
        );
      }

      setShowModal(false);
      setForm(emptyForm);
      setEditingProduct(null);

      await loadProducts();
    } catch (err) {
      const data = err.response?.data;

      setError(
        data?.error ||
          (data &&
          typeof data === "object"
            ? Object.values(data)[0]
            : null) ||
          "Unable to save insurance product."
      );
    } finally {
      setLoading(false);
    }
  };

  const deactivateProduct = async (
    product
  ) => {
    const confirmed = window.confirm(
      `Deactivate ${product.productName}?`
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await apiClient.patch(
        `/admin/products/${product.id}/deactivate`
      );

      setProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      setInactiveProducts((current) => [
        ...current,
        {
          ...product,
          active: false,
        },
      ]);

      setMessage(
        "Insurance product deactivated."
      );
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to deactivate product."
      );
    }
  };

  const activateProduct = async (
    product
  ) => {
    setMessage("");
    setError("");

    try {
      await apiClient.patch(
        `/admin/products/${product.id}/activate`
      );

      setInactiveProducts((current) =>
        current.filter(
          (item) => item.id !== product.id
        )
      );

      setMessage(
        "Insurance product activated."
      );

      await loadProducts();
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Unable to activate product."
      );
    }
  };

  return (
    <div className="page">
      <div className="page-heading split-heading">
        <div>
          <span className="eyebrow">
            PRODUCT MANAGEMENT
          </span>

          <h1>Insurance products</h1>

          <p>
            Create, update and control products
            available to customers.
          </p>
        </div>

        <button
          className="primary-button page-action-button"
          onClick={openCreateModal}
        >
          <PackagePlus size={16} />
          Create product
        </button>
      </div>

      {message && (
        <div className="success-alert">
          <CheckCircle2 size={16} />
          {message}
        </div>
      )}

      {error && (
        <div className="alert error-alert">
          {error}
        </div>
      )}

      <section className="admin-product-grid">
        {products.map((product) => (
          <article
            className="admin-product-card"
            key={product.id}
          >
            <div className="admin-product-header">
              <div className="product-icon">
                <PackageSearch size={22} />
              </div>

              <span className="status-badge active">
                ACTIVE
              </span>
            </div>

            <span className="category-pill">
              {product.productCategory}
            </span>

            <h3>{product.productName}</h3>

            <div className="admin-product-values">
              <div>
                <span>Coverage</span>

                <strong>
                  ₹
                  {Number(
                    product.coverageAmount
                  ).toLocaleString("en-IN")}
                </strong>
              </div>

              <div>
                <span>Premium</span>

                <strong>
                  ₹
                  {Number(
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

            <div className="admin-product-actions">
              <button
                className="secondary-action"
                onClick={() =>
                  openEditModal(product)
                }
              >
                <Edit3 size={14} />
                Edit
              </button>

              <button
                className="danger-action"
                onClick={() =>
                  deactivateProduct(product)
                }
              >
                <Power size={14} />
                Deactivate
              </button>
            </div>
          </article>
        ))}

        {products.length === 0 && (
          <div className="panel empty-row">
            No active products are available.
          </div>
        )}
      </section>

      {inactiveProducts.length > 0 && (
        <section className="panel inactive-products-panel">
          <div className="panel-header">
            <div>
              <h3>
                Recently deactivated products
              </h3>

              <p>
                Products deactivated during this
                administration session
              </p>
            </div>
          </div>

          {inactiveProducts.map((product) => (
            <div
              className="inactive-product-row"
              key={product.id}
            >
              <div>
                <strong>
                  {product.productName}
                </strong>

                <span>
                  {product.productCategory}
                </span>
              </div>

              <button
                className="secondary-action"
                onClick={() =>
                  activateProduct(product)
                }
              >
                <Power size={14} />
                Reactivate
              </button>
            </div>
          ))}
        </section>
      )}

      {showModal && (
        <div className="modal-backdrop">
          <div className="action-modal">
            <button
              className="modal-close"
              onClick={() =>
                setShowModal(false)
              }
            >
              <X size={18} />
            </button>

            <span className="eyebrow">
              {editingProduct
                ? "EDIT PRODUCT"
                : "NEW PRODUCT"}
            </span>

            <h2>
              {editingProduct
                ? "Update insurance product"
                : "Create insurance product"}
            </h2>

            <p className="modal-intro">
              Configure product coverage, premium
              and policy tenure.
            </p>

            <form
              className="modal-form"
              onSubmit={saveProduct}
            >
              <label>
                Product name

                <input
                  name="productName"
                  value={form.productName}
                  onChange={updateField}
                  required
                />
              </label>

              <label>
                Product category

                <select
                  name="productCategory"
                  value={
                    form.productCategory
                  }
                  onChange={updateField}
                >
                  <option value="HEALTH">
                    Health
                  </option>

                  <option value="MOTOR">
                    Motor
                  </option>

                  <option value="LIFE">
                    Life
                  </option>

                  <option value="TRAVEL">
                    Travel
                  </option>
                </select>
              </label>

              <div className="modal-form-row">
                <label>
                  Coverage amount

                  <input
                    type="number"
                    min="1"
                    name="coverageAmount"
                    value={
                      form.coverageAmount
                    }
                    onChange={updateField}
                    required
                  />
                </label>

                <label>
                  Premium amount

                  <input
                    type="number"
                    min="1"
                    name="premiumAmount"
                    value={form.premiumAmount}
                    onChange={updateField}
                    required
                  />
                </label>
              </div>

              <label>
                Policy tenure in months

                <input
                  type="number"
                  min="1"
                  name="policyTenureMonths"
                  value={
                    form.policyTenureMonths
                  }
                  onChange={updateField}
                  required
                />
              </label>

              <button
                className="primary-button"
                disabled={loading}
              >
                {loading
                  ? "Saving..."
                  : editingProduct
                    ? "Save changes"
                    : "Create product"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
