import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Events from "./pages/Events";
import Books from "./pages/Books";
import Movies from "./pages/Movies";
import Gallery from "./pages/Gallery";
import About from "./pages/About";

import Admin from "./admin/Admin";
import AdminEvents from "./admin/AdminEvents";
import AdminBooks from "./admin/AdminBooks";
import AdminMovies from "./admin/AdminMovies";
import AdminGallery from "./admin/AdminGallery";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Home />} />
        <Route path="/events" element={<Events />} />
        <Route path="/books" element={<Books />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/about" element={<About />} />

        {/* Admin */}
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/events" element={<AdminEvents />} />
        <Route path="/admin/books" element={<AdminBooks />} />
        <Route path="/admin/movies" element={<AdminMovies />} />
        <Route path="/admin/gallery" element={<AdminGallery />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;