import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

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

      <main className="page">
        <p className="eyebrow">OUR EVENTS</p>

        <h1>Events</h1>

        <p className="page-intro">
          Book discussions, movie nights and other gatherings
          with Hyderabad Bookworms.
        </p>

        {loading ? (
          <p>Loading events...</p>
        ) : events.length === 0 ? (
          <p>No events yet.</p>
        ) : (
          <div className="event-list">
            {events.map((event) => (
              <article className="event-card" key={event.id}>
                <div className="event-card-content">
                  <p className="eyebrow">
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
                    <p className="event-location">
                      📍 {event.location}
                    </p>
                  )}

                  {event.description && (
                    <p>{event.description}</p>
                  )}

                  {event.type && (
                    <span className="event-type">
                      {event.type}
                    </span>
                  )}
                </div>

                {event.image && (
                  <div className="event-card-image">
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