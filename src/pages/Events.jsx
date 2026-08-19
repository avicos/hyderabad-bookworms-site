import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function Events() {
  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">HYDERABAD BOOKWORMS</p>
        <h1>Events</h1>

        <p className="page-intro">
          Discover upcoming gatherings and explore events from our history.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default Events;