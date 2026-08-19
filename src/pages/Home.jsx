import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MonthlyFeature from "../components/MonthlyFeature";
import EventCard from "../components/EventCard";
import GalleryPreview from "../components/GalleryPreview";
import Footer from "../components/Footer";

function Home() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />

        <MonthlyFeature />

        <section className="events-section">
          <div className="section-heading">
            <p className="eyebrow">WHAT'S HAPPENING</p>
            <h2>Upcoming Events</h2>
          </div>

          <div className="events-grid">
            <EventCard
              date="14"
              month="SEP"
              title="September Book Club Meeting"
              description="Join us for an evening of discussion, books and good conversation."
              location="Hyderabad"
            />

            <EventCard
              date="28"
              month="SEP"
              title="Movie Night"
              description="A screening followed by a discussion with the group."
              location="Hyderabad"
            />
          </div>
        </section>

        <GalleryPreview />

        <section className="newsletter">
          <p className="eyebrow">STAY IN THE LOOP</p>
          <h2>Never miss an event.</h2>
          <p>
            Join the Hyderabad Bookworms mailing list and we'll let you know
            when something new is happening.
          </p>

          <form className="subscribe-form">
            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
            />
            <button type="submit">Subscribe</button>
          </form>
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;