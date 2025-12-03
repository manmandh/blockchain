import { useState } from "react";
import { useCart } from "../hooks/useCart";
import { useWallet } from "../hooks/useWallet";
import { useIPFS } from "../hooks/useIPFS";
import { submitCheckout } from "../api/checkout";
import { useOrderEvents } from "../hooks/useOrderEvents";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
  const { account, isConnected, connectWallet } = useWallet();
  const { uploadFile, isUploading } = useIPFS();

  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState(null);
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [eventMessage, setEventMessage] = useState(null);

  useOrderEvents((payload) => {
    setEventMessage(
      `Order created for ${payload.customer} • IPFS ${payload.ipfsHash}`
    );
  });

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    setAttachment(file ?? null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isConnected) {
      await connectWallet();
      return;
    }
    if (!items.length) {
      setError("Add dishes to your cart first.");
      return;
    }

    setIsSubmitting(true);
    setResult(null);
    setError(null);

    try {
      let attachmentCid;
      if (attachment) {
        attachmentCid = await uploadFile(attachment);
      }

      const response = await submitCheckout({
        cart: { items, subtotal },
        customerAddress: account,
        notes,
        attachmentCid,
      });

      setResult(response);
      clearCart();
    } catch (err) {
      setError(err.message || "Checkout failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.4em] text-white/50">
          Checkout
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-white">
          Finalize your order
        </h1>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-3xl border border-white/5 bg-white/5 p-6 text-white"
      >
        <div>
          <label className="text-sm text-slate-300">Wallet</label>
          <p className="mt-1 text-lg font-semibold">
            {isConnected ? account : "Not connected"}
          </p>
        </div>

        <div>
          <label className="text-sm text-slate-300">Order notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mt-2 w-full rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-sm text-white"
            rows={4}
            placeholder="Allergies, delivery instructions, plating requests..."
          />
        </div>

        <div>
          <label className="text-sm text-slate-300">Upload image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-slate-400 file:rounded-full file:border-0 file:bg-brand-orange file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white"
          />
          {isUploading && (
            <p className="mt-2 text-xs text-slate-400">Uploading to IPFS...</p>
          )}
        </div>

        <div className="flex items-center justify-between rounded-2xl border border-white/10 p-4">
          <span className="text-sm text-slate-300">Cart Total</span>
          <span className="text-2xl font-semibold">Ξ{subtotal.toFixed(3)}</span>
        </div>

        {error && (
          <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-200">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-brand-green py-4 text-lg font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
        >
          {isSubmitting ? "Processing..." : "Submit Order"}
        </button>
      </form>

      {result && (
        <div className="space-y-3 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 p-6 text-white">
          <p className="text-lg font-semibold">Order submitted!</p>
          <p className="text-sm text-emerald-100">
            IPFS CID:{" "}
            <span className="font-mono text-xs">{result.ipfsHash}</span>
          </p>
          {result.transactionHash && (
            <p className="text-sm text-emerald-100">
              Transaction:{" "}
              <span className="font-mono text-xs">
                {result.transactionHash}
              </span>
            </p>
          )}
        </div>
      )}
      {eventMessage && (
        <div className="rounded-3xl border border-emerald-400/30 bg-emerald-400/10 p-4 text-sm text-emerald-100">
          {eventMessage}
        </div>
      )}
    </div>
  );
}

