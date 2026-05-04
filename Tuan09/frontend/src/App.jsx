import { useEffect, useState } from 'react';

const productApi = import.meta.env.VITE_PRODUCT_API_URL || 'http://localhost:8081';
const cartApi = import.meta.env.VITE_CART_API_URL || 'http://localhost:8082';
const orderApi = import.meta.env.VITE_ORDER_API_URL || 'http://localhost:8083';

const formatMoney = (value) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);

export default function App() {
  const [userId, setUserId] = useState('user-001');
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState({ items: [], totalItems: 0 });
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [productsResponse, cartResponse] = await Promise.all([
          fetch(`${productApi}/products`),
          fetch(`${cartApi}/cart?userId=${encodeURIComponent(userId)}`),
        ]);
        const productsJson = await productsResponse.json();
        const cartJson = await cartResponse.json();
        setProducts(productsJson.products || []);
        setCart(cartJson);
      } catch (error) {
        setStatus(`Cannot load data: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    loadInitialData();
  }, []);

  useEffect(() => {
    const loadCartOnly = async () => {
      try {
        const response = await fetch(`${cartApi}/cart?userId=${encodeURIComponent(userId)}`);
        const json = await response.json();
        setCart(json);
      } catch (error) {
        setStatus(`Cannot refresh cart: ${error.message}`);
      }
    };

    loadCartOnly();
  }, [userId]);

  const refreshProducts = async () => {
    const response = await fetch(`${productApi}/products`);
    const json = await response.json();
    setProducts(json.products || []);
  };

  const refreshCart = async () => {
    const response = await fetch(`${cartApi}/cart?userId=${encodeURIComponent(userId)}`);
    const json = await response.json();
    setCart(json);
  };

  const handleAddToCart = async (productId) => {
    setStatus('');
    try {
      const response = await fetch(`${cartApi}/cart/add`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, productId, quantity: 1 }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || 'Add to cart failed');
      }
      setStatus(json.message || 'Added to cart');
      await Promise.all([refreshCart(), refreshProducts()]);
    } catch (error) {
      setStatus(error.message);
    }
  };

  const handleCheckout = async () => {
    setCheckoutLoading(true);
    setStatus('');
    try {
      const response = await fetch(`${orderApi}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId }),
      });
      const json = await response.json();
      if (!response.ok) {
        throw new Error(json.message || 'Checkout failed');
      }
      setStatus(`Checkout success: ${json.orderId}`);
      await Promise.all([refreshCart(), refreshProducts()]);
    } catch (error) {
      setStatus(error.message);
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return <div className="app-shell"><div className="loading-card">Loading flash sale dashboard...</div></div>;
  }

  return (
    <div className="app-shell">
      <header className="hero">
        <div>
          <p className="eyebrow">Space-Based Architecture</p>
          <h1>Flash Sale Control Center</h1>
          <p className="hero-copy">Product, cart, checkout, and inventory are split into independent processing units backed by Redis Data Grid.</p>
        </div>
        <div className="user-panel">
          <label htmlFor="userId">User ID</label>
          <input
            id="userId"
            value={userId}
            onChange={(event) => setUserId(event.target.value)}
            placeholder="user-001"
          />
          <button onClick={refreshCart}>Refresh Cart</button>
        </div>
      </header>

      {status ? <div className="status-bar">{status}</div> : null}

      <main className="grid-layout">
        <section className="panel products-panel">
          <div className="panel-title-row">
            <h2>Products</h2>
            <span>{products.length} items</span>
          </div>
          <div className="product-grid">
            {products.map((product) => (
              <article key={product.id} className="product-card">
                <div className="product-badge">Stock: {product.stock}</div>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <div className="product-footer">
                  <strong>{formatMoney(product.price)}</strong>
                  <button disabled={product.stock <= 0} onClick={() => handleAddToCart(product.id)}>
                    Add to cart
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="panel cart-panel">
          <div className="panel-title-row">
            <h2>Cart</h2>
            <span>{cart.totalItems || 0} products</span>
          </div>

          {cart.items && cart.items.length > 0 ? (
            <div className="cart-list">
              {cart.items.map((item) => (
                <div key={item.productId} className="cart-row">
                  <div>
                    <strong>{item.name}</strong>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span>{formatMoney(item.subtotal)}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">Cart is empty.</div>
          )}

          <div className="checkout-box">
            <div>
              <span>Total</span>
              <strong>{formatMoney(cart.totalPrice || 0)}</strong>
            </div>
            <button className="checkout-button" disabled={checkoutLoading} onClick={handleCheckout}>
              {checkoutLoading ? 'Processing...' : 'Checkout'}
            </button>
          </div>
        </section>
      </main>
    </div>
  );
}
