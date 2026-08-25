import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Event.css";

function Event() {
  const { slug } = useParams();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showRsvp, setShowRsvp] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .eq("slug", slug)
        .single();

      if (error) {
        console.error("Error fetching event:", error);
      } else {
        setEvent(data);
      }

      setLoading(false);
    }

    fetchEvent();
  }, [slug]);

  function formatEventDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatEventTime(time) {
    if (!time) return null;

    return new Date(
      `1970-01-01T${time}`
    ).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function addToGoogleCalendar(event) {
    const date = event.event_date.replaceAll("-", "");

    let start;
    let end;

    if (event.event_time) {
      const [hours, minutes] = event.event_time
        .split(":")
        .map(Number);

      const startDate = new Date(
        1970,
        0,
        1,
        hours,
        minutes
      );

      const endDate = new Date(startDate);

      // Default duration: 3 hours
      endDate.setHours(endDate.getHours() + 3);

      const startHours = String(hours).padStart(2, "0");
      const startMinutes = String(minutes).padStart(2, "0");

      const endHours = String(
        endDate.getHours()
      ).padStart(2, "0");

      const endMinutes = String(
        endDate.getMinutes()
      ).padStart(2, "0");

      start = `${date}T${startHours}${startMinutes}00`;
      end = `${date}T${endHours}${endMinutes}00`;
    } else {
      start = date;
      end = date;
    }

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${start}/${end}` +
      `&details=${encodeURIComponent(
        event.description || ""
      )}` +
      `&location=${encodeURIComponent(
        event.location || ""
      )}`;

    window.open(url, "_blank");
  }

  function openRsvp() {
    setShowRsvp(true);

    setName("");
    setEmail("");
    setRsvpMessage("");
    setRsvpSuccess(false);
  }

  function closeRsvp() {
    setShowRsvp(false);

    setName("");
    setEmail("");
    setRsvpMessage("");
    setRsvpSuccess(false);
  }

  async function handleRsvp(formEvent) {
    formEvent.preventDefault();

    if (!event) return;

    setRsvpLoading(true);
    setRsvpMessage("");

    const { error } = await supabase
      .from("event_rsvps")
      .insert([
        {
          event_id: event.id,
          name,
          email,
        },
      ]);

    if (error) {
      console.error("RSVP error:", error);

      if (error.code === "23505") {
        setRsvpMessage(
          "You're already on the RSVP list for this event."
        );
      } else {
        setRsvpMessage(
          "Something went wrong. Please try again."
        );
      }
    } else {
      setRsvpSuccess(true);

      setName("");
      setEmail("");
    }

    setRsvpLoading(false);
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="page event-page">
          <p>Loading event...</p>
        </main>

        <Footer />
      </>
    );
  }

  if (!event) {
    return (
      <>
        <Navbar />

        <main className="page event-page">
          <p className="eyebrow">EVENT NOT FOUND</p>

          <h1>We couldn't find that event.</h1>

          <Link to="/events">
            ← Back to Events
          </Link>
        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="page event-page">
        <Link
          to="/events"
          className="event-back"
        >
          ← All Events
        </Link>

        <article className="event-detail">
          {event.image && (
            <div className="event-detail-image">
              <img
                src={event.image}
                alt={event.title}
              />
            </div>
          )}

          <div className="event-detail-content">
            <p className="eyebrow">
              {event.type || "EVENT"}
            </p>

            <h1>{event.title}</h1>

            <div className="event-detail-meta">
              <p>
                📅 {formatEventDate(event.event_date)}
              </p>

              {event.event_time && (
                <p>
                  🕐 {formatEventTime(event.event_time)}
                </p>
              )}

              {event.location && (
                <p>
                  📍 {event.location}
                </p>
              )}
            </div>

            {event.description && (
              <p className="event-detail-description">
                {event.description}
              </p>
            )}

            <div className="event-detail-actions">
              <button
                className="event-detail-rsvp"
                onClick={openRsvp}
              >
                RSVP
              </button>

              <button
                className="event-detail-calendar"
                onClick={() =>
                  addToGoogleCalendar(event)
                }
              >
                Add to Calendar
              </button>
            </div>
          </div>
        </article>
      </main>

      {showRsvp && (
        <div
          className="rsvp-overlay"
          onClick={closeRsvp}
        >
          <div
            className="rsvp-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="rsvp-close"
              onClick={closeRsvp}
              aria-label="Close RSVP"
            >
              ×
            </button>

            {!rsvpSuccess ? (
              <>
                <p className="eyebrow">RSVP</p>

                <h2>{event.title}</h2>

                <p className="rsvp-date">
                  {formatEventDate(
                    event.event_date
                  )}

                  {event.event_time && (
                    <>
                      {" · "}
                      {formatEventTime(
                        event.event_time
                      )}
                    </>
                  )}
                </p>

                <form onSubmit={handleRsvp}>
                  <label>
                    Name

                    <input
                      type="text"
                      value={name}
                      onChange={(e) =>
                        setName(e.target.value)
                      }
                      required
                    />
                  </label>

                  <label>
                    Email

                    <input
                      type="email"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      required
                    />
                  </label>

                  {rsvpMessage && (
                    <p className="rsvp-message">
                      {rsvpMessage}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={rsvpLoading}
                  >
                    {rsvpLoading
                      ? "Confirming..."
                      : "Confirm RSVP"}
                  </button>
                </form>
              </>
            ) : (
              <div className="rsvp-success">
                <p className="eyebrow">
                  RSVP CONFIRMED
                </p>

                <h2>You're on the list!</h2>

                <p>
                  Your RSVP for{" "}
                  <strong>{event.title}</strong>{" "}
                  has been recorded.
                </p>

                <div className="calendar-buttons">
                  <button
                    type="button"
                    onClick={() =>
                      addToGoogleCalendar(event)
                    }
                  >
                    Add to Google Calendar
                  </button>
                </div>

                <button
                  className="rsvp-done-button"
                  onClick={closeRsvp}
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <Footer />
    </>
  );
}

export default Event;