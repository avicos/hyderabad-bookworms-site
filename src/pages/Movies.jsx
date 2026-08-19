import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Movies.css";

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

  // Group movies by year
  const groupedMovies = movies.reduce((acc, movie) => {
    if (!acc[movie.year]) {
      acc[movie.year] = [];
    }

    acc[movie.year].push(movie);

    return acc;
  }, {});

  const years = Object.keys(groupedMovies).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <>
      <Navbar />

      <main className="movies-page">
        <div className="movies-header">
          <p className="eyebrow">OUR WATCHING HISTORY</p>

          <h1>Movies</h1>

          <p className="movies-intro">
            Every Movie of the Month we've watched together.
          </p>
        </div>

        {loading ? (
          <p className="movies-loading">Loading movies...</p>
        ) : movies.length === 0 ? (
          <p className="movies-empty">
            No movies have been added yet.
          </p>
        ) : (
          <div className="movie-history">
            {years.map((year) => (
              <section className="movie-year" key={year}>
                <h2 className="movie-year-title">{year}</h2>

                <div className="movie-grid">
                  {groupedMovies[year].map((movie) => (
                    <article
                      className="movie-item"
                      key={movie.id}
                    >
                      <div className="movie-poster">
                        {movie.poster_image ? (
                          <img
                            src={movie.poster_image}
                            alt={movie.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="movie-poster-placeholder">
                            <span>{movie.title}</span>
                          </div>
                        )}
                      </div>

                      <div className="movie-info">
                        <h4>{movie.title}</h4>

                        {movie.director && (
                          <p>{movie.director}</p>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </>
  );
}

export default Movies;