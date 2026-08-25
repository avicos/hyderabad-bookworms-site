import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import "./AdminManager.css";

function AdminBooks() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [form, setForm] = useState({
    title: "",
    author: "",
    month: "",
    year: "",
    description: "",
    cover_image: "",
  });

  useEffect(() => {
    fetchBooks();
  }, []);

  async function fetchBooks() {
    const { data, error } = await supabase
      .from("books")
      .select("*")
      .order("year", { ascending: false })
      .order("month", { ascending: false });

    if (error) {
      console.error("Error fetching books:", error);
    } else {
      setBooks(data);
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
      author: "",
      month: "",
      year: "",
      description: "",
      cover_image: "",
    });

    setEditingBook(null);
  }

  function startEditing(book) {
    setEditingBook(book);

    setForm({
      title: book.title || "",
      author: book.author || "",
      month: book.month || "",
      year: book.year || "",
      description: book.description || "",
      cover_image: book.cover_image || "",
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setSaving(true);

    const bookData = {
      title: form.title,
      author: form.author,
      month: Number(form.month),
      year: Number(form.year),
      description: form.description,
      cover_image: form.cover_image,
    };

    if (editingBook) {
      const { error } = await supabase
        .from("books")
        .update(bookData)
        .eq("id", editingBook.id);

      if (error) {
        console.error(error);
        alert("Could not update book.");
      } else {
        resetForm();
        await fetchBooks();
      }
    } else {
      const { error } = await supabase
        .from("books")
        .insert([bookData]);

      if (error) {
        console.error(error);
        alert("Could not create book.");
      } else {
        resetForm();
        await fetchBooks();
      }
    }

    setSaving(false);
  }

  async function handleDelete(id) {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return;
    }

    const { error } = await supabase
      .from("books")
      .delete()
      .eq("id", id);

    if (error) {
      console.error(error);
      alert("Could not delete book.");
    } else {
      await fetchBooks();
    }
  }

  return (
    <main className="admin-manager">
      <header className="admin-manager-header">
        <div>
          <p className="eyebrow">ADMIN / BOOKS</p>
          <h1>Books</h1>
          <p>Manage the Book of the Month archive.</p>
        </div>

        <Link to="/admin" className="admin-back">
          ← Dashboard
        </Link>
      </header>

      <section className="admin-form-card">
        <h2>
          {editingBook ? "Edit Book" : "Add Book"}
        </h2>

        <form className="admin-form" onSubmit={handleSubmit}>
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
            <label>Author</label>
            <input
              name="author"
              value={form.author}
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
              <option value="">Select month</option>
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
            <label>Cover image URL</label>
            <input
              name="cover_image"
              value={form.cover_image}
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
                : editingBook
                ? "Update Book"
                : "Add Book"}
            </button>

            {editingBook && (
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
          <h2>Existing Books</h2>
          <span className="admin-list-count">
            {books.length} books
          </span>
        </div>

        {loading ? (
          <div className="admin-status">
            Loading books...
          </div>
        ) : books.length === 0 ? (
          <div className="admin-status">
            No books yet.
          </div>
        ) : (
          books.map((book) => (
            <article className="admin-item" key={book.id}>
              <div className="admin-item-main">
                <h3>{book.title}</h3>

                {book.author && (
                  <p>{book.author}</p>
                )}

                <p className="admin-item-meta">
                  {book.month}/{book.year}
                </p>
              </div>

              <div className="admin-item-actions">
                <button
                  className="admin-edit-button"
                  onClick={() => startEditing(book)}
                >
                  Edit
                </button>

                <button
                  className="admin-delete-button"
                  onClick={() => handleDelete(book.id)}
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

export default AdminBooks;