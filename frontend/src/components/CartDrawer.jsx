import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../hooks/useCart";

export default function CartDrawer({ isOpen, onClose }) {
  const { items, subtotal, updateItem, removeItem, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="fixed right-0 top-0 z-50 h-full w-full max-w-md border-l border-white/5 bg-slate-950/95 p-6 text-white backdrop-blur-xl"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Cart</h2>
              <button onClick={onClose} className="text-2xl">
                ×
              </button>
            </div>

            <div className="mt-6 space-y-4 overflow-y-auto pr-2">
              {items.length === 0 && (
                <p className="text-sm text-slate-300">
                  Your cart is empty. Add some vibrant dishes!
                </p>
              )}

              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-white/5 bg-white/5 p-4"
                >
                  <div>
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-slate-300">Ξ{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(item.id, Number(e.target.value))
                      }
                      className="w-16 rounded-lg bg-slate-900 px-2 py-1 text-center"
                    />
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-3 border-t border-white/5 pt-4">
              <div className="flex items-center justify-between text-sm text-slate-300">
                <span>Subtotal</span>
                <span className="text-lg font-semibold text-white">
                  Ξ{subtotal.toFixed(3)}
                </span>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={clearCart}
                  className="w-full rounded-2xl border border-white/10 px-4 py-3 text-sm text-slate-200"
                >
                  Clear
                </button>
                <Link
                  to="/checkout"
                  onClick={onClose}
                  className="w-full rounded-2xl bg-brand-orange px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Checkout
                </Link>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}

