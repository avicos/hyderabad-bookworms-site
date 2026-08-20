import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import "./Books.css";

function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    fetchBooks();
  }, []);

  // Group books by year
  const groupedBooks = books.reduce((acc, book) => {
    if (!acc[book.year]) {
      acc[book.year] = [];
    }

    acc[book.year].push(book);

    return acc;
  }, {});

  const years = Object.keys(groupedBooks).sort(
    (a, b) => Number(b) - Number(a)
  );

  return (
    <>
      <Navbar />

      <main className="books-page">
        <div className="books-header">
          <p className="eyebrow">OUR READING HISTORY</p>

          <h1>Books</h1>

          <p className="books-intro">
            Every Book of the Month we've read together.
          </p>
        </div>

        {loading ? (
          <p className="books-loading">Loading books...</p>
        ) : books.length === 0 ? (
          <p className="books-empty">
            No books have been added yet.
          </p>
        ) : (
          <div className="book-history">
            {years.map((year) => (
              <section className="book-year" key={year}>
                <h2 className="book-year-title">{year}</h2>

                <div className="book-grid">
                  {groupedBooks[year].map((book) => (
                    <article
                      className="book-item"
                      key={book.id}
                    >
                      <div className="book-cover">
                        {book.cover_image ? (
                          <img
                            src={book.cover_image}
                            alt={book.title}
                            loading="lazy"
                          />
                        ) : (
                          <div className="book-cover-placeholder">
                            <span>{book.title}</span>
                          </div>
                        )}
                      </div>

                      <div className="book-info">
                        <h4>{book.title}</h4>

                        {book.author && (
                          <p>{book.author}</p>
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

export default Books;