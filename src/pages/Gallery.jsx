import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Gallery() {
  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">MEMORIES</p>
        <h1>Gallery</h1>

        <p className="page-intro">
          Photos from our meetings, events and adventures.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Gallery;