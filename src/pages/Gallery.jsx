import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Gallery.css";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    <>
      <Navbar />

      <main className="gallery-page">
        <header className="gallery-page-header">
          <p className="eyebrow">MEMORIES</p>
          <h1>Gallery</h1>

          <p className="page-intro">
            Photos from our meetings, events and adventures.
          </p>
        </header>

        {loading ? (
          <p>Loading gallery...</p>
        ) : photos.length === 0 ? (
          <p>No photos yet.</p>
        ) : (
          <div className="gallery-full-grid">
            {photos.map((photo, index) => (
              <div className="gallery-full-photo" key={photo}>
                <img
                  src={photo}
                  alt={`Hyderabad Bookworms memory ${index + 1}`}
                />
              </div>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Gallery;