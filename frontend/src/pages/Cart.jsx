import { useCart } from "../hooks/useCart";
import { Link } from "react-router-dom";

export default function CartPage() {
  const { items, subtotal, updateItem, removeItem } = useCart();

  if (!items.length) {
    return (
      <div className="rounded-3xl border border-white/5 bg-white/5 p-8 text-center text-white">
        <p>Your cart is empty.</p>
        <Link to="/menu" className="mt-4 inline-block text-brand-orange">
          Browse the menu →
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 text-white">
      <h1 className="text-3xl font-semibold">Shopping Cart</h1>
      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col gap-4 rounded-2xl border border-white/5 bg-white/5 p-4 md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="text-lg font-semibold">{item.name}</p>
              <p className="text-sm text-slate-300">Ξ{item.price}</p>
            </div>
            <div className="flex items-center gap-4">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateItem(item.id, Number(e.target.value))}
                className="w-20 rounded-xl bg-slate-900 px-3 py-2 text-center"
              />
              <button
                onClick={() => removeItem(item.id)}
                className="text-sm text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4">
        <span className="text-lg text-slate-300">Subtotal</span>
        <span className="text-2xl font-semibold">Ξ{subtotal.toFixed(3)}</span>
      </div>
      <Link
        to="/checkout"
        className="inline-flex w-full items-center justify-center rounded-2xl bg-brand-green py-4 text-lg font-semibold"
      >
        Proceed to Checkout
      </Link>
    </div>
  );
}

