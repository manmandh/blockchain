import { useState } from "react";
import { Route, Routes } from "react-router-dom";
import { CartDrawer, Footer, Navbar } from "./components";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import ProductDetail from "./pages/ProductDetail";
import CartPage from "./pages/Cart";
import CheckoutPage from "./pages/Checkout";
import Register from "./pages/Register";
import Login from "./pages/Login";
import AdminDashboard from "./pages/AdminDashboard";
import { useAuth } from "./context/AuthContext";
import { Navigate } from "react-router-dom";

function App() {
  const [isCartOpen, setCartOpen] = useState(false);
  const { loading } = useAuth();

  const AdminRoute = ({ children }) => {
    if (loading) return <div>Loasding...</div>;
    // if (!isAuthenticated || user.role !== 'admin') {
    //   return <Navigate to="/login" />;
    // }
    return children;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top,_rgba(255,129,66,0.2),_transparent_50%)]" />
      <Navbar onCartToggle={() => setCartOpen(true)} />
      <main className="mx-auto max-w-6xl px-4 py-10">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/*"
            element={
              // eslint-disable-next-line react-hooks/static-components
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </main>
      <Footer />

      <button
        onClick={() => setCartOpen(true)}
        className="fixed bottom-6 right-6 flex h-14 w-14 items-center justify-center rounded-full bg-brand-orange text-2xl text-white shadow-2xl shadow-brand-orange/40 md:hidden"
        aria-label="Open cart"
      >
        🛒
      </button>

      <CartDrawer isOpen={isCartOpen} onClose={() => setCartOpen(false)} />
    </div>
  );
}

export default App;
