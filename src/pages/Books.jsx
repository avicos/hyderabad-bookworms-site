import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

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

  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">OUR READING HISTORY</p>

        <h1>Books</h1>

        <p className="page-intro">
          Every Book of the Month we've read together.
        </p>

        {loading ? (
          <p>Loading books...</p>
        ) : (
          <div className="book-list">
            {books.map((book) => (
              <article className="book-card" key={book.id}>
                <div className="book-card-image">
                  {book.cover_image ? (
                    <img
                      src={book.cover_image}
                      alt={book.title}
                    />
                  ) : (
                    <span>BOOK</span>
                  )}
                </div>

                <div className="book-card-content">
                  <p className="eyebrow">
                    {book.month}/{book.year}
                  </p>

                  <h2>{book.title}</h2>

                  {book.author && (
                    <p className="book-author">
                      {book.author}
                    </p>
                  )}

                  {book.description && (
                    <p>{book.description}</p>
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

export default Books;