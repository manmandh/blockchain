import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../hooks/useCart";

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    getProductById(id).then(setProduct);
  }, [id]);

  if (!product) {
    return <p className="text-slate-300">Loading product...</p>;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <img
        src={product.image}
        alt={product.name}
        className="w-full rounded-3xl object-cover"
      />
      <div className="space-y-6">
        <div>
          <p className="text-sm uppercase tracking-[0.4em] text-white/50">
            {product.category}
          </p>
          <h1 className="mt-2 text-4xl font-semibold text-white">
            {product.name}
          </h1>
          <p className="mt-3 text-lg text-slate-300">{product.description}</p>
        </div>

        <div className="flex items-center gap-4">
          <span className="rounded-full bg-white/10 px-4 py-2 text-2xl text-white">
            Ξ{product.price}
          </span>
          <button
            onClick={() => addItem(product, 1)}
            className="rounded-2xl bg-brand-orange px-6 py-3 text-sm font-semibold text-white"
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

