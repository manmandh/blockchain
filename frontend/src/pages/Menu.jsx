import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import ProductCard from "../components/ProductCard";
import { useCart } from "../hooks/useCart";

export default function Menu() {
  const [products, setProducts] = useState([]);
  const { addItem } = useCart();

  useEffect(() => {
    getProducts().then(setProducts);
  }, []);

  return (
    <div>
      <div className="mb-8">
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">
          Menu
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Crafted plates, transparent sourcing.
        </h1>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAdd={() => addItem(product, 1)}
          />
        ))}
      </div>
    </div>
  );
}

