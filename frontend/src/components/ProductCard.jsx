import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function ProductCard({ product, onAdd }) {
  return (
    <motion.div
      layout
      whileHover={{ y: -2 }}
      className="flex flex-col rounded-xl border border-white/5 bg-white/5 p-3 shadow-lg shadow-black/10 backdrop-blur"
    >
      <Link
        to={`/product/${product.id}`}
        className="relative h-40 w-full overflow-hidden rounded-lg bg-slate-900 mb-3"
      >
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
      </Link>
      <div className="flex flex-col gap-1 flex-grow">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-white">{product.name}</h3>
          <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white">
            Ξ{product.price}
          </span>
        </div>
        <p className="text-xs text-slate-300 flex-grow">{product.description}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {product.badges?.map((badge) => (
            <span
              key={badge}
              className="rounded-full bg-brand-orange/20 px-2 py-0.5 text-xs text-brand-orange"
            >
              {badge}
            </span>
          ))}
        </div>
        <button
          onClick={() => onAdd(product)}
          className="mt-3 w-full rounded-lg bg-brand-green px-3 py-1.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/10 transition hover:-translate-y-0.5"
        >
          Add to cart
        </button>
      </div>
    </motion.div>
  );
}

