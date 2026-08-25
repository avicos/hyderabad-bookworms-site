import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    location: "",
    type: "other",
    image: "",
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  async function fetchEvents() {
    const { data, error } = await supabase
      .from("events")
      .select("*")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("Error fetching events:", error);
    } else {
      setEvents(data);
    }

    setLoading(false);
  }

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function resetForm() {
    setForm({
      title: "",
      description: "",
      event_date: "",
      location: "",
      type: "other",
      image: "",
    });

    setEditingEvent(null);
  }

  function startEditing(event) {
    setEditingEvent(event);

    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date || "",
      location: event.location || "",
      type: event.type || "other",
      image: event.image || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    if (editingEvent) {
      const { error } = await supabase
        .from("events")
        .update(form)
        .eq("id", editingEvent.id);

      if (error) {
        console.error(error);
        alert("Could not update event.");
      } else {
        resetForm();
        await fetchEvents();
      }
    } else {
      const { error } = await supabase
        .from("events")
        .insert([form]);

      if (error) {
        console.error(error);
        alert("Could not create event.");
      } else {
        resetForm();
        await fetchEvents();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const { error } = await supabase
      .from("events")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete event.");
    } else {
      await fetchEvents();
    }
  }

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / EVENTS</p>
          <h1>Events</h1>
          <p>Manage upcoming and past events.</p>
        </div>

        <Link to="/admin" className="admin-back">
          ← Dashboard
        </Link>
      </header>

      <section className="admin-form-card">
        <h2>
          {editingEvent ? "Edit Event" : "Add Event"}
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-field">
            <label>Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-field">
            <label>Date</label>
            <input
              type="date"
              name="event_date"
              value={form.event_date}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-field">
            <label>Location</label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field">
            <label>Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="book">Book</option>
              <option value="movie">Movie</option>
              <option value="social">Social</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="admin-field full-width">
            <label>Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field full-width">
            <label>Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-actions">
            <button
              className="admin-primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingEvent
                ? "Update Event"
                : "Add Event"}
            </button>

            {editingEvent && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list">
        <div className="admin-list-header">
          <h2>Existing Events</h2>
          <span className="admin-list-count">
            {events.length} events
          </span>
        </div>

        {loading ? (
          <div className="admin-status">
            Loading events...
          </div>
        ) : events.length === 0 ? (
          <div className="admin-status">
            No events yet.
          </div>
        ) : (
          events.map((event) => (
            <article className="admin-item" key={event.id}>
              <div className="admin-item-main">
                <h3>{event.title}</h3>

                <p>
                  {new Date(
                    `${event.event_date}T00:00:00`
                  ).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>

                {event.location && (
                  <p>{event.location}</p>
                )}

                {event.type && (
                  <p className="admin-item-meta">
                    {event.type}
                  </p>
                )}
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-edit-button"
                  onClick={() => startEditing(event)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => handleDelete(event.id)}
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

export default AdminEvents;