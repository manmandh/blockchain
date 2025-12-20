import { Link, NavLink } from "react-router-dom";
import WalletButton from "./WalletButton";
import { useTheme } from "../hooks/useTheme";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const baseNavItems = [
  { label: "Home", path: "/" },
  { label: "Menu", path: "/menu" },
  { label: "Cart", path: "/cart" },
  { label: "Checkout", path: "/checkout" },
];

export default function Navbar({ onCartToggle }) {
  const { toggleTheme, isDark } = useTheme();
  const { isAuthenticated, user, logout } = useAuth(); // Get user object
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    ...baseNavItems,
    ...(isAuthenticated && user && user.role === "admin"
      ? [{ label: "Admin", path: "/admin" }]
      : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/5 bg-slate-900/70 backdrop-blur-xl dark:bg-slate-900/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <span className="rounded-full bg-brand-orange px-3 py-1 text-sm text-white">
            FoodChain
          </span>
          <span className="text-sm text-slate-300">Fresh • Local • On-chain</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `text-sm font-medium transition ${
                  isActive ? "text-brand-orange" : "text-slate-300 hover:text-white"
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}

          {!isAuthenticated ? (
            <>
              <NavLink
                to="/register"
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-brand-orange" : "text-slate-300 hover:text-white"
                  }`
                }
              >
                Register
              </NavLink>
              <NavLink
                to="/login"
                className={({ isActive }) =>
                  `text-sm font-medium transition ${
                    isActive ? "text-brand-orange" : "text-slate-300 hover:text-white"
                  }`
                }
              >
                Login
              </NavLink>
            </>
          ) : (
            <button
              onClick={logout}
              className="text-sm font-medium transition text-slate-300 hover:text-white"
            >
              Logout
            </button>
          )}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onCartToggle}
            className="hidden rounded-full border border-white/10 px-4 py-2 text-sm text-white md:flex"
          >
            Cart
          </button>
          <button
            onClick={toggleTheme}
            className="rounded-full border border-white/10 p-2 text-slate-100 transition hover:border-white/30"
            aria-label="Toggle theme"
          >
            {isDark ? "🌙" : "☀️"}
          </button>
          <WalletButton />
          <button
            className="md:hidden"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <span className="text-2xl text-white">☰</span>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="border-t border-white/5 bg-slate-900/90 px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className="text-sm font-medium text-slate-100"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.label}
              </NavLink>
            ))}
            {!isAuthenticated ? (
              <>
                <NavLink
                  to="/register"
                  className="text-sm font-medium text-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </NavLink>
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-100"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </NavLink>
              </>
            ) : (
              <button
                onClick={() => {
                  logout();
                  setIsMenuOpen(false);
                }}
                className="rounded-full border border-white/10 px-4 py-2 text-left text-sm text-white"
              >
                Logout
              </button>
            )}
            <button
              onClick={() => {
                onCartToggle?.();
                setIsMenuOpen(false);
              }}
              className="rounded-full border border-white/10 px-4 py-2 text-left text-sm text-white"
            >
              Cart
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}
