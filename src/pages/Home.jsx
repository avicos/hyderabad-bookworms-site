import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MonthlyFeature from "../components/MonthlyFeature";
import EventCard from "../components/EventCard";
import GalleryPreview from "../components/GalleryPreview";
import Footer from "../components/Footer";

import { supabase } from "../lib/supabase";

function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      const today = new Date().toISOString().split("T")[0];

      const { data, error } = await supabase
        .from("events")
        .select("*")
        .gte("event_date", today)
        .order("event_date", { ascending: true })
        .limit(3);

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }

      setEventsLoading(false);
    }

    fetchEvents();
  }, []);

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

          {eventsLoading ? (
            <p>Loading events...</p>
          ) : events.length === 0 ? (
            <p>No upcoming events at the moment.</p>
          ) : (
            <div className="events-grid">
              {events.map((event) => {
                const date = new Date(`${event.event_date}T00:00:00`);

                return (
                  <EventCard
                    key={event.id}
                    date={date.toLocaleDateString("en-IN", {
                      day: "2-digit",
                    })}
                    month={date
                      .toLocaleDateString("en-IN", {
                        month: "short",
                      })
                      .toUpperCase()}
                    title={event.title}
                    description={event.description}
                    location={event.location}
                  />
                );
              })}
            </div>
          )}
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