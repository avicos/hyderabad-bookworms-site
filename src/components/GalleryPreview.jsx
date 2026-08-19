function GalleryPreview() {
  return (
    <section className="gallery-section">
      <div className="section-heading gallery-heading">
        <div>
          <p className="eyebrow">MEMORIES</p>
          <h2>From our gallery</h2>
        </div>

        <a href="/gallery">View gallery →</a>
      </div>

      <div className="gallery-grid">
        <div className="gallery-placeholder">PHOTO</div>
        <div className="gallery-placeholder">PHOTO</div>
        <div className="gallery-placeholder">PHOTO</div>
        <div className="gallery-placeholder">PHOTO</div>
      </div>
    </section>
  );
}

export default GalleryPreview;