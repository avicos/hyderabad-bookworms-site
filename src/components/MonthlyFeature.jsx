import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";
import "./MonthlyFeature.css";
function MonthlyFeature() {
  const [book, setBook] = useState(null);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMonthlyFeatures() {
      const now = new Date();

      const currentMonth = now.getMonth() + 1;
      const currentYear = now.getFullYear();

      const [bookResult, movieResult] = await Promise.all([
        supabase
          .from("books")
          .select("*")
          .eq("month", currentMonth)
          .eq("year", currentYear)
          .maybeSingle(),

        supabase
          .from("movies")
          .select("*")
          .eq("month", currentMonth)
          .eq("year", currentYear)
          .maybeSingle(),
      ]);

      if (bookResult.error) {
        console.error("Error fetching book:", bookResult.error);
      } else {
        setBook(bookResult.data);
      }

      if (movieResult.error) {
        console.error("Error fetching movie:", movieResult.error);
      } else {
        setMovie(movieResult.data);
      }

      setLoading(false);
    }

    fetchMonthlyFeatures();
  }, []);

  const monthName = new Date().toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <section className="monthly-section">
      <div className="section-heading">
        <p className="eyebrow">{monthName.toUpperCase()}</p>
        <h2>This Month</h2>
      </div>

      {loading ? (
        <p>Loading this month's selections...</p>
      ) : (
        <div className="monthly-grid">

          {/* BOOK */}
          <article className="feature-card">
            <div className="feature-placeholder book-placeholder">
              {book?.cover_image ? (
                <img
                  src={book.cover_image}
                  alt={book.title}
                />
              ) : (
                <span>BOOK</span>
              )}
            </div>

            <div className="feature-content">
              <p className="eyebrow">BOOK OF THE MONTH</p>

              <h3>
                {book ? book.title : "No book selected"}
              </h3>

              {book?.author && (
                <p>{book.author}</p>
              )}

              {book?.description && (
                <p>{book.description}</p>
              )}

              <a href="/books">View books →</a>
            </div>
          </article>

          {/* MOVIE */}
          <article className="feature-card">
            <div className="feature-placeholder movie-placeholder">
              {movie?.poster_image ? (
                <img
                  src={movie.poster_image}
                  alt={movie.title}
                />
              ) : (
                <span>MOVIE</span>
              )}
            </div>

            <div className="feature-content">
              <p className="eyebrow">MOVIE OF THE MONTH</p>

              <h3>
                {movie ? movie.title : "No movie selected"}
              </h3>

              {movie?.director && (
                <p>{movie.director}</p>
              )}

              {movie?.description && (
                <p>{movie.description}</p>
              )}

              <a href="/movies">View movies →</a>
            </div>
          </article>

        </div>
      )}
    </section>
  );
}

export default MonthlyFeature;