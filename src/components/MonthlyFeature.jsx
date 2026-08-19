function MonthlyFeature() {
  return (
    <section className="monthly-section">
      <div className="section-heading">
        <p className="eyebrow">AUGUST 2026</p>
        <h2>This Month</h2>
      </div>

      <div className="monthly-grid">
        <article className="feature-card">
          <div className="feature-placeholder book-placeholder">
            BOOK
          </div>

          <div className="feature-content">
            <p className="eyebrow">BOOK OF THE MONTH</p>
            <h3>Our featured book</h3>
            <p>
              Discover what Hyderabad Bookworms are reading and join the
              conversation.
            </p>
            <a href="/books">View book →</a>
          </div>
        </article>

        <article className="feature-card">
          <div className="feature-placeholder movie-placeholder">
            MOVIE
          </div>

          <div className="feature-content">
            <p className="eyebrow">MOVIE OF THE MONTH</p>
            <h3>Our featured movie</h3>
            <p>
              This month's film selection and everything you need to know
              before the discussion.
            </p>
            <a href="/movies">View movie →</a>
          </div>
        </article>
      </div>
    </section>
  );
}

export default MonthlyFeature;