function Navbar() {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <a href="/" className="brand">
          Hyderabad
          <span>Bookworms</span>
        </a>

        <nav>
          <a href="/">Home</a>
          <a href="/events">Events</a>
          <a href="/books">Books</a>
          <a href="/movies">Movies</a>
          <a href="/gallery">Gallery</a>
          <a href="/about">About</a>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;