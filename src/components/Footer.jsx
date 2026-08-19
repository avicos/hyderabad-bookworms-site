function Footer() {
  return (
    <footer className="footer">
      <div>
        <strong>Hyderabad Bookworms</strong>
        <p>A community of readers in Hyderabad.</p>
      </div>

      <div className="footer-links">
        <a href="/contact">Contact</a>
        <a href="/about">About</a>
      </div>

      <p className="copyright">
        © {new Date().getFullYear()} Hyderabad Bookworms
      </p>
    </footer>
  );
}

export default Footer;