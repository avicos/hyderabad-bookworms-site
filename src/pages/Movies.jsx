import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMovies() {
      const { data, error } = await supabase
        .from("movies")
        .select("*")
        .order("year", { ascending: false })
        .order("month", { ascending: false });

      if (error) {
        console.error("Error fetching movies:", error);
      } else {
        setMovies(data);
      }

      setLoading(false);
    }

    fetchMovies();
  }, []);

  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">OUR WATCHING HISTORY</p>

        <h1>Movies</h1>

        <p className="page-intro">
          Every Movie of the Month we've watched together.
        </p>

        {loading ? (
          <p>Loading movies...</p>
        ) : movies.length === 0 ? (
          <p>No movies yet.</p>
        ) : (
          <div className="book-list">
            {movies.map((movie) => (
              <article className="book-card" key={movie.id}>
                <div className="book-card-image">
                  {movie.poster_image ? (
                    <img
                      src={movie.poster_image}
                      alt={movie.title}
                    />
                  ) : (
                    <span>MOVIE</span>
                  )}
                </div>

                <div className="book-card-content">
                  <p className="eyebrow">
                    {movie.month}/{movie.year}
                  </p>

                  <h2>{movie.title}</h2>

                  {movie.director && (
                    <p className="book-author">
                      Directed by {movie.director}
                    </p>
                  )}

                  {movie.description && (
                    <p>{movie.description}</p>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Movies;