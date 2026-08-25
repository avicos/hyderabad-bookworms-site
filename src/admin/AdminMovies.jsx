import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminMovies() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingMovie, setEditingMovie] = useState(null);

  const [form, setForm] = useState({
    title: "",
    director: "",
    month: "",
    year: "",
    description: "",
    poster_image: "",
  });

  useEffect(() => {
    fetchMovies();
  }, []);

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

  function handleChange(event) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  function resetForm() {
    setForm({
      title: "",
      director: "",
      month: "",
      year: "",
      description: "",
      poster_image: "",
    });

    setEditingMovie(null);
  }

  function startEditing(movie) {
    setEditingMovie(movie);

    setForm({
      title: movie.title || "",
      director: movie.director || "",
      month: movie.month || "",
      year: movie.year || "",
      description: movie.description || "",
      poster_image: movie.poster_image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    const movieData = {
      title: form.title,
      director: form.director,
      month: Number(form.month),
      year: Number(form.year),
      description: form.description,
      poster_image: form.poster_image,
    };

    if (editingMovie) {
      const { error } = await supabase
        .from("movies")
        .update(movieData)
        .eq("id", editingMovie.id);

      if (error) {
        console.error(error);
        alert("Could not update movie.");
      } else {
        resetForm();
        await fetchMovies();
      }
    } else {
      const { error } = await supabase
        .from("movies")
        .insert([movieData]);

      if (error) {
        console.error(error);
        alert("Could not create movie.");
      } else {
        resetForm();
        await fetchMovies();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    if (
      !window.confirm(
        "Are you sure you want to delete this movie?"
      )
    ) {
      return;
    }

    const { error } = await supabase
      .from("movies")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete movie.");
    } else {
      await fetchMovies();
    }
  }

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / MOVIES</p>

          <h1>Movies</h1>

          <p>
            Manage the Movie of the Month archive.
          </p>
        </div>

        <Link
          to="/admin"
          className="admin-back"
        >
          ← Dashboard
        </Link>
      </header>

      <section className="admin-form-card">
        <h2>
          {editingMovie
            ? "Edit Movie"
            : "Add Movie"}
        </h2>

        <form
          className="admin-form"
          onSubmit={handleSubmit}
        >
          <div className="admin-field">
            <label>Title</label>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-field">
            <label>Director</label>

            <input
              name="director"
              value={form.director}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field">
            <label>Month</label>

            <select
              name="month"
              value={form.month}
              onChange={handleChange}
              required
            >
              <option value="">
                Select month
              </option>

              <option value="1">January</option>
              <option value="2">February</option>
              <option value="3">March</option>
              <option value="4">April</option>
              <option value="5">May</option>
              <option value="6">June</option>
              <option value="7">July</option>
              <option value="8">August</option>
              <option value="9">September</option>
              <option value="10">October</option>
              <option value="11">November</option>
              <option value="12">December</option>
            </select>
          </div>

          <div className="admin-field">
            <label>Year</label>

            <input
              type="number"
              name="year"
              value={form.year}
              onChange={handleChange}
              required
            />
          </div>

          <div className="admin-field full-width">
            <label>Description</label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
            />
          </div>

          <div className="admin-field full-width">
            <label>Poster image URL</label>

            <input
              name="poster_image"
              value={form.poster_image}
              onChange={handleChange}
              placeholder="https://..."
            />
          </div>

          <div className="admin-form-actions">
            <button
              className="admin-primary-button"
              type="submit"
              disabled={saving}
            >
              {saving
                ? "Saving..."
                : editingMovie
                ? "Update Movie"
                : "Add Movie"}
            </button>

            {editingMovie && (
              <button
                className="admin-secondary-button"
                type="button"
                onClick={resetForm}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </section>

      <section className="admin-list">
        <div className="admin-list-header">
          <h2>Existing Movies</h2>

          <span className="admin-list-count">
            {movies.length} movies
          </span>
        </div>

        {loading ? (
          <div className="admin-status">
            Loading movies...
          </div>
        ) : movies.length === 0 ? (
          <div className="admin-status">
            No movies yet.
          </div>
        ) : (
          movies.map((movie) => (
            <article
              className="admin-item"
              key={movie.id}
            >
              <div className="admin-item-main">
                <h3>{movie.title}</h3>

                {movie.director && (
                  <p>{movie.director}</p>
                )}

                <p className="admin-item-meta">
                  {movie.month}/{movie.year}
                </p>
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-edit-button"
                  onClick={() =>
                    startEditing(movie)
                  }
                >
                  Edit
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() =>
                    handleDelete(movie.id)
                  }
                >
                  Delete
                </button>
              </div>
            </article>
          ))
        )}
      </section>
    </main>
  );
}

export default AdminMovies;