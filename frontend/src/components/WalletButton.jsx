import { useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthContext";

export default function WalletButton() {
  const {
    isConnected,
    shortAddress,
    connectWallet,
    switchWallet,
    disconnectWallet,
    isConnecting,
  } = useWallet();
  const { isDark } = useTheme();
  const { isAuthenticated, loading } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const closeMenu = () => setIsMenuOpen(false);

  const handleConnect = async () => {
    await connectWallet();
    closeMenu();
  };

  const handleSwitch = async () => {
    await switchWallet();
    closeMenu();
  };

  const handleDisconnect = () => {
    disconnectWallet();
    closeMenu();
  };

  if (loading) {
    return null; // Or a loading spinner
  }

  if (isConnected) {
    return (
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen((prev) => !prev)}
          className="flex items-center gap-2 rounded-full border border-emerald-400/50 px-4 py-2 text-sm font-semibold text-emerald-100 shadow-lg shadow-emerald-500/20 transition hover:scale-[1.02]"
        >
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          {shortAddress}
        </button>
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-48 rounded-2xl border border-white/10 bg-slate-900/95 p-3 text-sm text-white shadow-2xl backdrop-blur-md">
            <button
              onClick={handleSwitch}
              className="w-full rounded-xl px-3 py-2 text-left text-slate-200 transition hover:bg-white/10"
            >
              Switch Wallet
            </button>
            <button
              onClick={handleDisconnect}
              className="mt-2 w-full rounded-xl px-3 py-2 text-left text-red-300 transition hover:bg-red-500/10"
            >
              Disconnect
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    isAuthenticated ? (
    <button
      disabled={isConnecting}
      onClick={handleConnect}
      className={`rounded-full px-6 py-2 text-sm font-semibold text-white transition ${
        isDark
          ? "bg-brand-green hover:bg-emerald-500"
          : "bg-brand-orange hover:bg-orange-500"
      }`}
    >
      {isConnecting ? "Connecting..." : "Connect Wallet"}
    </button>
    ) : (
      <span className="text-sm text-slate-300">Login to connect wallet</span>
    )
  );
}

