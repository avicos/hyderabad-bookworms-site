import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminSubscribers() {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSubscribers();
  }, []);

  async function fetchSubscribers() {
    const { data, error } = await supabase
      .from("subscribers")
      .select("*")
      .order("subscribed_at", { ascending: false });

    if (error) {
      console.error("Error fetching subscribers:", error);
    } else {
      setSubscribers(data);
    }

    setLoading(false);
  }

  async function toggleActive(subscriber) {
    const { error } = await supabase
      .from("subscribers")
      .update({
        active: !subscriber.active,
      })
      .eq("id", subscriber.id);

    if (error) {
      console.error(error);
      alert("Could not update subscriber.");
    } else {
      await fetchSubscribers();
    }
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this subscriber?"
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("subscribers")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete subscriber.");
    } else {
      await fetchSubscribers();
    }
  }

  const activeCount = subscribers.filter(
    (subscriber) => subscriber.active
  ).length;

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / SUBSCRIBERS</p>

          <h1>Subscribers</h1>

          <p>
            Manage people subscribed to the
            Hyderabad Bookworms mailing list.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-back"
        >
          ← Dashboard
        </Link>
      </header>

      <section className="admin-list">
        <div className="admin-list-header">
          <h2>Mailing List</h2>

          <span className="admin-list-count">
            {activeCount} active · {subscribers.length} total
          </span>
        </div>

        {loading ? (
          <div className="admin-status">
            Loading subscribers...
          </div>
        ) : subscribers.length === 0 ? (
          <div className="admin-status">
            No subscribers yet.
          </div>
        ) : (
          subscribers.map((subscriber) => (
            <article
              className="admin-item"
              key={subscriber.id}
            >
              <div className="admin-item-main">
                <h3>
                  {subscriber.name || "No name"}
                </h3>

                <p>{subscriber.email}</p>

                <p className="admin-item-meta">
                  Subscribed{" "}
                  {new Date(
                    subscriber.subscribed_at
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-edit-button"
                  onClick={() =>
                    toggleActive(subscriber)
                  }
                >
                  {subscriber.active
                    ? "Deactivate"
                    : "Activate"}
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() =>
                    handleDelete(subscriber.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminSubscribers;