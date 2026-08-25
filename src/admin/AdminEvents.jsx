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
    event_time: "",
    location: "",
    type: "other",
    image: "",
  });

  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

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

  function createSlug(title, date) {
    const titleSlug = title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    return `${titleSlug}-${date}`;
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please choose an image file.");
      return;
    }

    setSelectedImage(file);

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  }

  function resetForm() {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }

    setForm({
      title: "",
      description: "",
      event_date: "",
      event_time: "",
      location: "",
      type: "other",
      image: "",
    });

    setSelectedImage(null);
    setImagePreview("");
    setEditingEvent(null);
  }

  function startEditing(event) {
    setEditingEvent(event);

    setForm({
      title: event.title || "",
      description: event.description || "",
      event_date: event.event_date || "",
      event_time: event.event_time || "",
      location: event.location || "",
      type: event.type || "other",
      image: event.image || "",
    });

    setSelectedImage(null);
    setImagePreview(event.image || "");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function deleteStorageImage(imageUrl) {
    if (!imageUrl) return;

    const marker = "/storage/v1/object/public/events/";

    if (!imageUrl.includes(marker)) {
      return;
    }

    const filePath = imageUrl.split(marker)[1];

    if (!filePath) return;

    const { error } = await supabase.storage.from("events").remove([filePath]);

    if (error) {
      console.error("Could not delete event image:", error);
    }
  }

  async function uploadImage(file, slug) {
    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";

    const filePath = `${slug}-${Date.now()}.${extension}`;

    const { error } = await supabase.storage
      .from("events")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("events").getPublicUrl(filePath);

    return publicUrl;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.title || !form.event_date) {
      alert("Please enter a title and date.");
      return;
    }

    setSaving(true);

    try {
      const slug = createSlug(form.title, form.event_date);

      let imageUrl = form.image;

      /*
       * Upload a new image if one was selected.
       */
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage, slug);
      }

      const eventData = {
        ...form,
        slug,
        image: imageUrl || null,
      };

      if (editingEvent) {
        const { error } = await supabase
          .from("events")
          .update(eventData)
          .eq("id", editingEvent.id);

        if (error) {
          throw error;
        }

        /*
         * Only delete the old image after the database
         * update succeeded and only if a new image
         * was uploaded.
         */
        if (
          selectedImage &&
          editingEvent.image &&
          editingEvent.image !== imageUrl
        ) {
          await deleteStorageImage(editingEvent.image);
        }
      } else {
        const { error } = await supabase.from("events").insert([eventData]);

        if (error) {
          /*
           * If the database insert fails after uploading,
           * clean up the newly uploaded image.
           */
          if (selectedImage && imageUrl) {
            await deleteStorageImage(imageUrl);
          }

          throw error;
        }
      }

      resetForm();
      await fetchEvents();
    } catch (error) {
      console.error(error);

      if (error.code === "23505") {
        alert("An event with this title and date already exists.");
      } else {
        alert("Could not save event. Please try again.");
      }
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    const eventToDelete = events.find((event) => event.id === id);

    if (!window.confirm("Are you sure you want to delete this event?")) {
      return;
    }

    const { error } = await supabase.from("events").delete().eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete event.");
      return;
    }

    if (eventToDelete?.image) {
      await deleteStorageImage(eventToDelete.image);
    }

    await fetchEvents();
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
        <h2>{editingEvent ? "Edit Event" : "Add Event"}</h2>

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
            <label>Time</label>

            <input
              type="time"
              name="event_time"
              value={form.event_time}
              onChange={handleChange}
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

            <select name="type" value={form.type} onChange={handleChange}>
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
            <label>Event Image</label>

            <label className="admin-image-upload">
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
              />

              <span className="admin-image-upload-icon">↑</span>

              <span className="admin-image-upload-title">
                {selectedImage
                  ? "Change image"
                  : imagePreview
                    ? "Replace image"
                    : "Choose event image"}
              </span>

              <span className="admin-image-upload-help">PNG, JPG or WebP</span>
            </label>

            {imagePreview && (
              <div className="admin-image-preview">
                <img src={imagePreview} alt="Event preview" />
              </div>
            )}
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

          <span className="admin-list-count">{events.length} events</span>
        </div>

        {loading ? (
          <div className="admin-status">Loading events...</div>
        ) : events.length === 0 ? (
          <div className="admin-status">No events yet.</div>
        ) : (
          events.map((event) => (
            <article className="admin-item" key={event.id}>
              <div className="admin-item-main">
                <h3>{event.title}</h3>

                <p>
                  {new Date(`${event.event_date}T00:00:00`).toLocaleDateString(
                    "en-IN",
                    {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    },
                  )}
                </p>

                {event.event_time && (
                  <p>
                    {new Date(
                      `1970-01-01T${event.event_time}`,
                    ).toLocaleTimeString("en-IN", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </p>
                )}

                {event.location && <p>{event.location}</p>}

                {event.type && <p className="admin-item-meta">{event.type}</p>}

                {event.slug && (
                  <p className="admin-item-meta">/events/{event.slug}</p>
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
