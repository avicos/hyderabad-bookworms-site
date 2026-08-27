import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./Admin.css";

function Admin() {
  const [session, setSession] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(true);
  const [loggingIn, setLoggingIn] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function getSession() {
      const { data } = await supabase.auth.getSession();

      setSession(data.session);
      setLoading(false);
    }

    getSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogin(event) {
    event.preventDefault();

    setLoggingIn(true);
    setError("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
    }

    setLoggingIn(false);
  }

  async function handleLogout() {
    await supabase.auth.signOut();
  }

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!session) {
    return (
      <main className="admin-login">
        <div className="admin-login-card">
          <p className="eyebrow">HYDERABAD BOOKWORMS</p>

          <h1>Admin</h1>

          <p>Sign in to manage the website.</p>

          <form onSubmit={handleLogin}>
            <label>
              Email
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>

            {error && <p className="admin-error">{error}</p>}

            <button type="submit" disabled={loggingIn}>
              {loggingIn ? "Signing in..." : "Sign in"}
            </button>
          </form>
        </div>
      </main>
    );
  }

  return (
    <main className="admin-dashboard">
      <header className="admin-header">
        <div>
          <p className="eyebrow">HYDERABAD BOOKWORMS</p>

          <h1>Admin Dashboard</h1>

          <p>Welcome back.</p>
        </div>

        <button onClick={handleLogout}>Sign out</button>
      </header>

      <section className="admin-options">
        <Link to="/admin/events">
          <span>📅</span>
          <strong>Events</strong>
          <small>Add, edit and delete events</small>
        </Link>

        <Link to="/admin/books">
          <span>📚</span>
          <strong>Books</strong>
          <small>Manage Book of the Month</small>
        </Link>

        <Link to="/admin/movies">
          <span>🎬</span>
          <strong>Movies</strong>
          <small>Manage Movie of the Month</small>
        </Link>

        <Link to="/admin/gallery">
          <span>📷</span>
          <strong>Gallery</strong>
          <small>Upload and remove photos</small>
        </Link>

        <Link to="/admin/subscribers">
          <span>📧</span>
          <strong>Subscribers</strong>
          <small>Manage the mailing list</small>
        </Link>

        <Link to="/admin/secret-santa">
          <span>🎅</span>
          <strong>Secret Santa</strong>
          <small>Manage participants and assignments</small>
        </Link>
      </section>
    </main>
  );
}

export default Admin;
