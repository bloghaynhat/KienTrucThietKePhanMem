import { useEffect, useMemo, useState } from 'react';

const ORCHESTRATOR_URL = import.meta.env.VITE_ORCHESTRATOR_URL || 'http://localhost:8080';

async function apiRequest(path, options = {}) {
  const response = await fetch(`${ORCHESTRATOR_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {})
    },
    ...options
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

const defaultLogin = {
  username: 'admin',
  password: '123456'
};

export default function App() {
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [bookingForm, setBookingForm] = useState({ travelDate: '', participants: 1 });
  const [user, setUser] = useState(null);
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState(null);
  const [loadingTours, setLoadingTours] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');
  const [bookingResult, setBookingResult] = useState(null);

  const isLoggedIn = Boolean(user);
  const selectedTourId = selectedTour?.id || '';

  useEffect(() => {
    loadTours();
  }, []);

  useEffect(() => {
    if (user && !selectedTour && tours.length > 0) {
      loadTourDetail(tours[0].id);
    }
  }, [user, selectedTour, tours]);

  useEffect(() => {
    if (selectedTour && !bookingForm.travelDate) {
      const nextDate = new Date();
      nextDate.setDate(nextDate.getDate() + 7);
      setBookingForm((current) => ({
        ...current,
        travelDate: nextDate.toISOString().slice(0, 10)
      }));
    }
  }, [selectedTour, bookingForm.travelDate]);

  async function loadTours() {
    setLoadingTours(true);
    setError('');

    try {
      const data = await apiRequest('/tours');
      setTours(data.tours || []);
      if ((data.tours || []).length > 0 && !selectedTour) {
        const firstTour = data.tours[0];
        await loadTourDetail(firstTour.id);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTours(false);
    }
  }

  async function loadTourDetail(tourId) {
    setError('');
    try {
      const data = await apiRequest(`/tours/${tourId}`);
      setSelectedTour(data.tour);
      setBookingResult(null);
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleLogin(event) {
    event.preventDefault();
    setNotice('');
    setError('');

    try {
      const data = await apiRequest('/login', {
        method: 'POST',
        body: JSON.stringify(loginForm)
      });

      setUser(data.user);
      setNotice(`Logged in as ${data.user.name}`);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleLogout() {
    setUser(null);
    setSelectedTour(null);
    setBookingForm({ travelDate: '', participants: 1 });
    setBookingResult(null);
    setNotice('');
    setError('');
  }

  async function handleBook(event) {
    event.preventDefault();
    setNotice('');
    setError('');
    setSubmitting(true);

    try {
      const data = await apiRequest('/book-tour', {
        method: 'POST',
        body: JSON.stringify({
          userId: user.id,
          tourId: selectedTourId,
          travelDate: bookingForm.travelDate,
          participants: bookingForm.participants
        })
      });

      setBookingResult(data);
      setNotice(data.success ? 'Booking completed' : 'Booking created, but payment failed');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  const selectedSummary = useMemo(() => {
    if (!selectedTour) {
      return null;
    }

    return `${selectedTour.location} · ${selectedTour.duration}`;
  }, [selectedTour]);

  return (
    <div className="app-shell">
      <div className="ambient ambient-a" />
      <div className="ambient ambient-b" />

      {!isLoggedIn ? (
        <main className="layout auth-layout">
          <section className="auth-card card">
            <div className="auth-copy">
              <span className="eyebrow">Orchestration-Driven SOA</span>
              <h1>Travel Booking System</h1>
              <p>
                Đăng nhập để vào hệ thống đặt tour. Frontend chỉ làm việc với Orchestrator, còn xác thực, tra cứu
                tour, đặt chỗ và thanh toán đều được điều phối phía sau.
              </p>
              <div className="auth-note">API: {ORCHESTRATOR_URL}</div>
            </div>

            <div className="auth-panel">
              <div className="panel-header auth-header">
                <div>
                  <span className="auth-kicker">Sign in</span>
                  <h2>Login</h2>
                </div>
                <span className="badge">Guest</span>
              </div>

              <form className="stack auth-form" onSubmit={handleLogin}>
                <label>
                  Username
                  <input
                    value={loginForm.username}
                    onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                    placeholder="admin"
                  />
                </label>
                <label>
                  Password
                  <input
                    type="password"
                    value={loginForm.password}
                    onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                    placeholder="123456"
                  />
                </label>
                <button className="primary" type="submit">Login via Orchestrator</button>
              </form>

              <div className="info-box auth-info">
                <strong>Tài khoản mẫu</strong>
                <span>admin / 123456</span>
              </div>
            </div>
          </section>
        </main>
      ) : (
        <main className="layout dashboard-layout">
          <section className="hero card">
            <div className="hero-copy">
              <span className="eyebrow">Orchestration-Driven SOA</span>
              <h1>Travel Booking System</h1>
              <p>
                Frontend only talks to the Orchestrator. The Orchestrator then coordinates user validation,
                tour lookup, booking creation, and payment.
              </p>
              <div className="meta-row">
                <span>Orchestrator: {ORCHESTRATOR_URL}</span>
                <span>Services split by folder</span>
              </div>
            </div>
            <div className="hero-stats">
              <div>
                <strong>{tours.length}</strong>
                <span>tours loaded</span>
              </div>
              <div>
                <strong>{user ? '1' : '0'}</strong>
                <span>active login</span>
              </div>
              <div>
                <strong>{bookingResult ? '1' : '0'}</strong>
                <span>latest booking</span>
              </div>
            </div>
          </section>

          <section className="grid">
            <div className="card panel tours-panel">
              <div className="panel-header">
                <h2>Tours</h2>
                <div className="actions-row">
                  <button className="ghost" type="button" onClick={loadTours} disabled={loadingTours}>
                    {loadingTours ? 'Refreshing...' : 'Refresh'}
                  </button>
                  <button className="ghost" type="button" onClick={handleLogout}>
                    Logout
                  </button>
                </div>
              </div>
              <div className="tour-list">
                {tours.map((tour) => (
                  <button
                    key={tour.id}
                    type="button"
                    className={`tour-item ${selectedTourId === tour.id ? 'active' : ''}`}
                    onClick={() => loadTourDetail(tour.id)}
                  >
                    <div>
                      <strong>{tour.name}</strong>
                      <span>{tour.location}</span>
                    </div>
                    <span>{tour.price.toLocaleString('vi-VN')} VND</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="card panel account-panel">
              <div className="panel-header">
                <h2>Account</h2>
                <span className="badge success">Signed in</span>
              </div>
              <div className="info-box">
                <strong>{user.name}</strong>
                <span>{user.email}</span>
                <span>User ID: {user.id}</span>
                <button className="ghost account-logout" type="button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            </div>
          </section>

          <section className="grid lower-grid">
            <div className="card panel detail-panel">
              <div className="panel-header">
                <h2>Tour Detail</h2>
                {selectedSummary && <span className="badge">{selectedSummary}</span>}
              </div>

              {selectedTour ? (
                <div className="detail-stack">
                  <div className="detail-hero">
                    <h3>{selectedTour.name}</h3>
                    <p>{selectedTour.description}</p>
                  </div>
                  <div className="detail-metrics">
                    <div>
                      <span>Location</span>
                      <strong>{selectedTour.location}</strong>
                    </div>
                    <div>
                      <span>Duration</span>
                      <strong>{selectedTour.duration}</strong>
                    </div>
                    <div>
                      <span>Price</span>
                      <strong>{selectedTour.price.toLocaleString('vi-VN')} VND</strong>
                    </div>
                  </div>

                  <form className="stack" onSubmit={handleBook}>
                    <label>
                      Travel date
                      <input
                        type="date"
                        value={bookingForm.travelDate}
                        onChange={(event) => setBookingForm((current) => ({ ...current, travelDate: event.target.value }))}
                      />
                    </label>
                    <label>
                      Participants
                      <input
                        type="number"
                        min="1"
                        value={bookingForm.participants}
                        onChange={(event) => setBookingForm((current) => ({ ...current, participants: event.target.value }))}
                      />
                    </label>
                    <button className="primary" type="submit" disabled={!user || submitting}>
                      {submitting ? 'Processing...' : 'Book Tour'}
                    </button>
                  </form>
                </div>
              ) : (
                <div className="empty-state">Select a tour to view details.</div>
              )}
            </div>

            <div className="card panel result-panel">
              <div className="panel-header">
                <h2>Result</h2>
                {bookingResult?.success ? <span className="badge success">Success</span> : <span className="badge warning">Pending</span>}
              </div>
              {bookingResult ? (
                <div className="result-stack">
                  <div className="result-banner">
                    <strong>{bookingResult.message}</strong>
                    <span>{bookingResult.paymentMessage || 'No payment message'}</span>
                  </div>
                  <pre>{JSON.stringify(bookingResult, null, 2)}</pre>
                </div>
              ) : (
                <div className="empty-state">The latest booking response will appear here.</div>
              )}
            </div>
          </section>
        </main>
      )}

      {(notice || error) && (
        <section className={`toast ${error ? 'error' : 'success'}`}>
          {error || notice}
        </section>
      )}
    </div>
  );
}
