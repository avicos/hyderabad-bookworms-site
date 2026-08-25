import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchPhotos();
  }, []);

  async function fetchPhotos() {
    const { data, error } = await supabase.storage
      .from("gallery")
      .list("", {
        limit: 100,
        sortBy: {
          column: "created_at",
          order: "desc",
        },
      });

    if (error) {
      console.error("Error fetching photos:", error);
    } else {
      setPhotos(
        data.filter(
          (file) => file.name !== ".emptyFolderPlaceholder"
        )
      );
    }

    setLoading(false);
  }

  async function handleUpload(event) {
    const files = Array.from(event.target.files);

    if (!files.length) return;

    setUploading(true);

    for (const file of files) {
      const fileExtension = file.name.split(".").pop();

      const fileName = `${Date.now()}-${crypto.randomUUID()}.${fileExtension}`;

      const { error } = await supabase.storage
        .from("gallery")
        .upload(fileName, file);

      if (error) {
        console.error("Upload error:", error);
        alert(`Could not upload ${file.name}`);
      }
    }

    await fetchPhotos();

    setUploading(false);

    event.target.value = "";
  }

  async function handleDelete(fileName) {
    if (
      !window.confirm(
        "Are you sure you want to delete this photo?"
      )
    ) {
      return;
    }

    const { error } = await supabase.storage
      .from("gallery")
      .remove([fileName]);

    if (error) {
      console.error("Delete error:", error);
      alert("Could not delete photo.");
    } else {
      await fetchPhotos();
    }
  }

  function getPublicUrl(fileName) {
    const { data } = supabase.storage
      .from("gallery")
      .getPublicUrl(fileName);

    return data.publicUrl;
  }

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / GALLERY</p>

          <h1>Gallery</h1>

          <p>
            Upload and manage photos from
            Hyderabad Bookworms events.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-back"
        >
          ← Dashboard
        </Link>
      </header>

      <section className="admin-form-card gallery-upload-card">
        <h2>Add Photos</h2>

        <p className="gallery-upload-description">
          Select one or more images from your computer.
          PNG, JPG and other standard image formats are
          supported.
        </p>

        <label className="admin-upload-button">
          {uploading
            ? "Uploading..."
            : "Choose Photos"}

          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleUpload}
            disabled={uploading}
            hidden
          />
        </label>

        {uploading && (
          <p className="gallery-upload-status">
            Uploading photos...
          </p>
        )}
      </section>

      <section className="admin-list">
        <div className="admin-list-header">
          <h2>Photos</h2>

          <span className="admin-list-count">
            {photos.length} photos
          </span>
        </div>

        {loading ? (
          <div className="admin-status">
            Loading photos...
          </div>
        ) : photos.length === 0 ? (
          <div className="admin-status">
            No photos yet.
          </div>
        ) : (
          <div className="admin-gallery-grid">
            {photos.map((photo) => (
              <article
                className="admin-gallery-item"
                key={photo.name}
              >
                <img
                  src={getPublicUrl(photo.name)}
                  alt={photo.name}
                />

                <div className="admin-gallery-item-footer">
                  <p title={photo.name}>
                    {photo.name}
                  </p>

                  <button
                    type="button"
                    onClick={() =>
                      handleDelete(photo.name)
                    }
                  >
                    Delete
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}

export default AdminGallery;