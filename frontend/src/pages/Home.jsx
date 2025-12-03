import { useEffect, useState } from "react";
import { getFeaturedProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    getFeaturedProducts().then(setFeatured);
  }, []);

  return (
    <div className="space-y-16">
      <section className="grid gap-8 rounded-3xl border border-white/5 bg-gradient-to-r from-brand-orange/20 via-transparent to-brand-green/20 p-8 shadow-2xl backdrop-blur">
        <div className="space-y-4">
          <p className="text-sm uppercase tracking-[0.3em] text-white/70">
            Hyperfresh food on-chain
          </p>
          <h1 className="text-4xl font-semibold text-white md:text-5xl">
            Taste the future of food commerce.
          </h1>
          <p className="text-lg text-slate-300 md:max-w-2xl">
            Curated farm-to-table dishes, verified on Ethereum, with every order
            pinned to IPFS. Enjoy artisan meals, pay with crypto, and own your
            dining story.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/menu"
              className="rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-900"
            >
              Explore Menu
            </Link>
            <Link
              to="/checkout"
              className="rounded-full border border-white/40 px-6 py-3 text-sm font-semibold text-white"
            >
              Checkout
            </Link>
          </div>
        </div>
      </section>

      <section>
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Featured Dishes
          </h2>
          <Link to="/menu" className="text-sm text-brand-orange">
            View full menu →
          </Link>
        </div>
        <div className="mt-6 grid gap-6 md:grid-cols-2">
          {featured.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAdd={() => addItem(product, 1)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

