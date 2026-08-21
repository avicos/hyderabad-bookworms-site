import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchEvents();
  }, []);

  return (
    <>
      <Navbar />

      <main className="events-page">
        <header className="events-header">
          <p className="eyebrow">OUR EVENTS</p>

          <h1>Events</h1>

          <p className="page-intro">
            Book discussions, movie nights and other gatherings
            with Hyderabad Bookworms.
          </p>
        </header>

        {loading ? (
          <p className="events-loading">Loading events...</p>
        ) : events.length === 0 ? (
          <p className="events-empty">No events yet.</p>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <article className="events-card" key={event.id}>
                <div className="events-card-content">
                  <p className="eyebrow events-card-date">
                    {new Date(event.event_date).toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      }
                    )}
                  </p>

                  <h2>{event.title}</h2>

                  {event.location && (
                    <p className="events-card-location">
                      📍 {event.location}
                    </p>
                  )}

                  {event.description && (
                    <p className="events-card-description">
                      {event.description}
                    </p>
                  )}

                  {event.type && (
                    <span className="events-card-type">
                      {event.type}
                    </span>
                  )}
                </div>

                {event.image && (
                  <div className="events-card-image">
                    <img
                      src={event.image}
                      alt={event.title}
                    />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Events;