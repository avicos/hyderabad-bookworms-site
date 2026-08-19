function EventCard({ date, month, title, description, location }) {
  return (
    <article className="event-card">
      <div className="event-date">
        <strong>{date}</strong>
        <span>{month}</span>
      </div>

      <div className="event-info">
        <h3>{title}</h3>

        <p>{description}</p>

        <div className="event-location">
          📍 {location}
        </div>

        <a href="/events">View event →</a>
      </div>
    </article>
  );
}

export default EventCard;