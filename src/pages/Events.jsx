import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Events.css";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [rsvpLoading, setRsvpLoading] = useState(false);
  const [rsvpSuccess, setRsvpSuccess] = useState(false);
  const [rsvpMessage, setRsvpMessage] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      const { data, error } = await supabase
        .from("events")
        .select("*")
        .order("event_date", { ascending: true });

      if (error) {
        console.error("Error fetching events:", error);
      } else {
        setEvents(data);
      }

      setLoading(false);
    }

    fetchEvents();
  }, []);

  function openRsvp(event) {
    setSelectedEvent(event);

    setName("");
    setEmail("");
    setRsvpMessage("");
    setRsvpSuccess(false);
  }

  function closeRsvp() {
    setSelectedEvent(null);

    setName("");
    setEmail("");
    setRsvpMessage("");
    setRsvpSuccess(false);
  }

  async function handleRsvp(event) {
    event.preventDefault();

    if (!selectedEvent) return;

    setRsvpLoading(true);
    setRsvpMessage("");

    const { error } = await supabase.from("event_rsvps").insert([
      {
        event_id: selectedEvent.id,
        name,
        email,
      },
    ]);

    if (error) {
      console.error("RSVP error:", error);

      if (error.code === "23505") {
        setRsvpMessage("You're already on the RSVP list for this event.");
      } else {
        setRsvpMessage("Something went wrong. Please try again.");
      }
    } else {
      setRsvpSuccess(true);
      setRsvpMessage("");

      setName("");
      setEmail("");
    }

    setRsvpLoading(false);
  }

  function formatEventDate(date) {
    return new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function formatEventTime(time) {
    if (!time) return null;

    return new Date(`1970-01-01T${time}`).toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
    });
  }

  function getCalendarDateTime(event) {
    const date = event.event_date.replaceAll("-", "");

    if (!event.event_time) {
      return {
        start: `${date}`,
        end: `${date}`,
      };
    }

    const [hours, minutes] = event.event_time.split(":").map(Number);

    const startDate = new Date(1970, 0, 1, hours, minutes);

    const endDate = new Date(startDate);

    // Default event duration: 3 hours
    endDate.setHours(endDate.getHours() + 3);

    const time = event.event_time.replace(":", "").slice(0, 4);

    const endHours = String(endDate.getHours()).padStart(2, "0");

    const endMinutes = String(endDate.getMinutes()).padStart(2, "0");

    return {
      start: `${date}T${time}00`,
      end: `${date}T${endHours}${endMinutes}00`,
    };
  }

  function addToGoogleCalendar(event) {
    const { start, end } = getCalendarDateTime(event);

    const url =
      "https://calendar.google.com/calendar/render?action=TEMPLATE" +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${start}/${end}` +
      `&details=${encodeURIComponent(event.description || "")}` +
      `&location=${encodeURIComponent(event.location || "")}`;

    window.open(url, "_blank");
  }

  function downloadCalendarFile(event) {
    const { start, end } = getCalendarDateTime(event);

    const description = event.description || "";
    const location = event.location || "";

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Hyderabad Bookworms//Events//EN",
      "BEGIN:VEVENT",
      `UID:${event.id}@hydbookworms`,
      `DTSTAMP:${new Date()
        .toISOString()
        .replace(/[-:]/g, "")
        .replace(/\.\d{3}/, "")}`,
      `DTSTART:${start}`,
      `DTEND:${end}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${description.replace(/\n/g, "\\n")}`,
      `LOCATION:${location}`,
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = `${event.title
      .replace(/[^a-z0-9]/gi, "-")
      .toLowerCase()}.ics`;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  }

  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">OUR EVENTS</p>

        <h1>Events</h1>

        <p className="page-intro">
          Book discussions, movie nights and other gatherings with Hyderabad
          Bookworms.
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
                  <p className="eyebrow">{formatEventDate(event.event_date)}</p>

                  <h2>{event.title}</h2>

                  {event.location && (
                    <p className="event-location">📍 {event.location}</p>
                  )}

                  {event.event_time && (
                    <p className="event-time">
                      🕐 {formatEventTime(event.event_time)}
                    </p>
                  )}

                  {event.description && <p>{event.description}</p>}

                  {event.type && (
                    <span className="event-type">{event.type}</span>
                  )}

                  <button
                    className="event-rsvp-button"
                    onClick={() => openRsvp(event)}
                  >
                    RSVP
                  </button>
                </div>

                {event.image && (
                  <div className="event-card-image">
                    <img src={event.image} alt={event.title} />
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </main>

      {selectedEvent && (
        <div className="rsvp-overlay" onClick={closeRsvp}>
          <div
            className="rsvp-modal"
            onClick={(event) => event.stopPropagation()}
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

                <h2>{selectedEvent.title}</h2>

                <p className="rsvp-date">
                  {formatEventDate(selectedEvent.event_date)}

                  {selectedEvent.event_time && (
                    <>
                      {" · "}
                      {formatEventTime(selectedEvent.event_time)}
                    </>
                  )}
                </p>

                <form onSubmit={handleRsvp}>
                  <label>
                    Name
                    <input
                      type="text"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      required
                    />
                  </label>

                  <label>
                    Email
                    <input
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />
                  </label>

                  {rsvpMessage && <p className="rsvp-message">{rsvpMessage}</p>}

                  <button type="submit" disabled={rsvpLoading}>
                    {rsvpLoading ? "Confirming..." : "Confirm RSVP"}
                  </button>
                </form>
              </>
            ) : (
              <div className="rsvp-success">
                <p className="eyebrow">RSVP CONFIRMED</p>

                <h2>You're on the list!</h2>

                <p>
                  Your RSVP for <strong>{selectedEvent.title}</strong> has been
                  recorded.
                </p>

                <p>Don't forget to add the event to your calendar.</p>

                <div className="calendar-buttons">
                  <button
                    type="button"
                    onClick={() => addToGoogleCalendar(selectedEvent)}
                  >
                    Add to Google Calendar
                  </button>

                  <button
                    type="button"
                    onClick={() => downloadCalendarFile(selectedEvent)}
                  >
                    Download Calendar Event
                  </button>
                </div>

                <button className="rsvp-done-button" onClick={closeRsvp}>
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

export default Events;
