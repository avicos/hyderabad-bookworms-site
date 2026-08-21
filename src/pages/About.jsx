import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./About.css";

function About() {
  return (
    <>
      <Navbar />
      <main className="about-page">
        <header className="about-header">
          <p className="eyebrow">WHO WE ARE</p>

          <h1>About Hyderabad Bookworms</h1>

          <p className="about-intro">
            A community built around books, movies, conversations and shared
            experiences.
          </p>
        </header>

        <section className="about-content">
          <div className="about-section">
            <p className="eyebrow">THE CLUB</p>

            <h2>More than just a reading group.</h2>

            <p>
              Hyderabad Bookworms brings people together through books, movies
              and the conversations that follow. We meet regularly, share
              recommendations and make space for different perspectives.
            </p>

            <p>
              Whether you've been reading for years or are simply looking for
              your next great book, everyone is welcome.
            </p>
          </div>

          <div className="about-section">
            <p className="eyebrow">WHAT WE DO</p>

            <div className="about-list">
              <div>
                <span>01</span>
                <h3>Book of the Month</h3>
                <p>
                  Each month, we choose a book and come together to discuss it.
                </p>
              </div>

              <div>
                <span>02</span>
                <h3>Movie of the Month</h3>
                <p>
                  We watch a film and bring the same curiosity and conversation
                  to the screen.
                </p>
              </div>

              <div>
                <span>03</span>
                <h3>Events & Gatherings</h3>
                <p>
                  From discussions to social evenings, there's always something
                  happening.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <section className="connect-section">
        <p className="eyebrow">CONNECT WITH US</p>

        <h2>Follow the Bookworms.</h2>

        <p>
          Follow us on Instagram for updates, upcoming events, book and movie
          picks, and moments from the club.
        </p>

        <a
          href="https://www.instagram.com/hyderabadbookworms/"
          target="_blank"
          rel="noopener noreferrer"
          className="instagram-link"
        >
          @hyderabadbookworms →
        </a>
      </section>
      <Footer />
    </>
  );
}

export default About;
