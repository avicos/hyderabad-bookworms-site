import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import MonthlyFeature from "../components/MonthlyFeature";
import EventCard from "../components/EventCard";
import GalleryPreview from "../components/GalleryPreview";
import Footer from "../components/Footer";



function Home() {
  const [events, setEvents] = useState([]);
  const [eventsLoading, setEventsLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribeMessage, setSubscribeMessage] = useState("");
  const [subscriberName, setSubscriberName] = useState("");
  const [subscriberEmail, setSubscriberEmail] = useState("");

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
  async function handleSubscribe(event) {
    event.preventDefault();

    if (!email.trim()) {
      setSubscribeMessage("Please enter your email address.");
      return;
    }

    setSubscribing(true);
    setSubscribeMessage("");

    const { error } = await supabase.from("subscribers").insert([
      {
        email: email.trim().toLowerCase(),
      },
    ]);

    if (error) {
      if (error.code === "23505") {
        setSubscribeMessage("You're already subscribed!");
      } else {
        console.error("Subscription error:", error);
        setSubscribeMessage("Something went wrong. Please try again.");
      }
    } else {
      setSubscribeMessage("You're subscribed! 🎉");
      setEmail("");
    }

    setSubscribing(false);
  }

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

          <form
            className="subscribe-form"
            onSubmit={async (event) => {
              event.preventDefault();

              setSubscribing(true);
              setSubscribeMessage("");

              const { error } = await supabase.from("subscribers").insert([
                {
                  name: subscriberName,
                  email: subscriberEmail,
                  active: true,
                },
              ]);

              if (error) {
                if (error.code === "23505") {
                  setSubscribeMessage("You're already subscribed.");
                } else {
                  console.error(error);
                  setSubscribeMessage(
                    "Something went wrong. Please try again.",
                  );
                }
              } else {
                setSubscribeMessage(
                  "You're subscribed! Welcome to the Bookworms.",
                );

                setSubscriberName("");
                setSubscriberEmail("");
              }

              setSubscribing(false);
            }}
          >
            <input
              type="text"
              placeholder="Your name"
              aria-label="Your name"
              value={subscriberName}
              onChange={(event) => setSubscriberName(event.target.value)}
              required
            />

            <input
              type="email"
              placeholder="your@email.com"
              aria-label="Email address"
              value={subscriberEmail}
              onChange={(event) => setSubscriberEmail(event.target.value)}
              required
            />

            <button type="submit" disabled={subscribing}>
              {subscribing ? "Subscribing..." : "Subscribe"}
            </button>
          </form>

          {subscribeMessage && (
            <p className="subscribe-message">{subscribeMessage}</p>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}

export default Home;
