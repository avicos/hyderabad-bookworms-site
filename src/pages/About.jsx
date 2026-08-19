import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function About() {
  return (
    <>
      <Navbar />

      <main className="page">
        <p className="eyebrow">WHO WE ARE</p>
        <h1>About</h1>

        <p className="page-intro">
          Hyderabad Bookworms is a community built around books, movies,
          conversations and shared experiences.
        </p>
      </main>

      <Footer />
    </>
  );
}

export default About;