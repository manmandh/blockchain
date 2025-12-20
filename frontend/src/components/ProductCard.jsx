// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -4 }}
      className="rounded-3xl border border-white/5 bg-white/5 p-4 shadow-xl shadow-black/20 backdrop-blur"
    >
      <Link
        to={`/product/${product.id}`}
        className="aspect-[4/3] overflow-hidden rounded-2xl bg-slate-900"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </Link>
      <div className="mt-4 flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-white">{product.name}</h3>
          <span className="rounded-full bg-white/10 px-3 py-1 text-sm text-white">
            Ξ{product.price}
          </span>
        </div>
        <p className="text-sm text-slate-300">{product.description}</p>
        <div className="flex flex-wrap gap-2">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-brand-orange/20 px-3 py-1 text-xs text-brand-orange"
            >
              {badge}
            </span>
          ))}
        </div>
        <button
          onClick={() => onAdd(product)}
          className="mt-4 rounded-2xl bg-brand-green px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-emerald-500/20 transition hover:-translate-y-0.5"
        >
          Add to cart
        </button>
      </div>
    </motion.div>
  );
}

