import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./GalleryPreview.css";

function GalleryPreview() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      const { data, error } = await supabase.storage
        .from("gallery")
        .list("", {
          limit: 4,
          sortBy: {
            column: "created_at",
            order: "desc",
          },
        });

      if (error) {
        console.error("Error fetching gallery:", error);
      } else {
        const photoUrls = data
          .filter((file) => file.name !== ".emptyFolderPlaceholder")
          .map((file) => {
            const { data: publicUrl } = supabase.storage
              .from("gallery")
              .getPublicUrl(file.name);

            return publicUrl.publicUrl;
          });

        setPhotos(photoUrls);
      }

      setLoading(false);
    }

    fetchPhotos();
  }, []);

  return (
    <section className="gallery-section">
      <div className="section-heading gallery-heading">
        <div>
          <p className="eyebrow">MEMORIES</p>
          <h2>From our gallery</h2>
        </div>

        <a href="/gallery">View gallery →</a>
      </div>

      {loading ? (
        <p>Loading gallery...</p>
      ) : photos.length === 0 ? (
        <p>No photos yet.</p>
      ) : (
        <div className="gallery-grid">
          {photos.map((photo, index) => (
            <div className="gallery-photo" key={photo}>
              <img
                src={photo}
                alt={`Hyderabad Bookworms memory ${index + 1}`}
              />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default GalleryPreview;