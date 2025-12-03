export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-slate-950 text-slate-300">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-4 py-8 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-sm font-semibold text-white">FoodChain Commerce</p>
          <p className="text-xs text-slate-400">
            Powered by Web3.js · Orders stored on IPFS · 100% transparent.
          </p>
        </div>
        <div className="flex gap-4 text-xs uppercase tracking-wide text-slate-400">
          <a href="https://hardhat.org" target="_blank" rel="noreferrer">
            Hardhat
          </a>
          <a href="https://vitejs.dev" target="_blank" rel="noreferrer">
            Vite
          </a>
          <a href="https://tailwindcss.com" target="_blank" rel="noreferrer">
            Tailwind
          </a>
        </div>
      </div>
    </footer>
  );
}

