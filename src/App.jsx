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
import ProtectedAdminRoute from "./admin/ProtectedAdminRoute";

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

        <Route
          path="/admin/events"
          element={
            <ProtectedAdminRoute>
              <AdminEvents />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/books"
          element={
            <ProtectedAdminRoute>
              <AdminBooks />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/movies"
          element={
            <ProtectedAdminRoute>
              <AdminMovies />
            </ProtectedAdminRoute>
          }
        />

        <Route
          path="/admin/gallery"
          element={
            <ProtectedAdminRoute>
              <AdminGallery />
            </ProtectedAdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
