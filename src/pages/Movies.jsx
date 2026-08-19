import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Movies() {
  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">OUR WATCHING HISTORY</p>
        <h1>Movies</h1>

        <p className="page-intro">
          Every Movie of the Month we've watched together.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Movies;