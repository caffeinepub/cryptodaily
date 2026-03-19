import { Skeleton } from "@/components/ui/skeleton";
import { Loader2, TrendingUp } from "lucide-react";
import { useGetPrices } from "../hooks/useQueries";

const COIN_COLORS: Record<string, string> = {
  BTC: "text-crypto-gold",
  ETH: "text-purple-400",
  SOL: "text-crypto-cyan",
};

const COIN_ICONS: Record<string, string> = {
  BTC: "₿",
  ETH: "Ξ",
  SOL: "◎",
};

function formatPrice(price: number): string {
  if (price >= 1000) {
    return price.toLocaleString("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
  }
  return price.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

export function PriceBar() {
  const { data: prices, isLoading } = useGetPrices();

  const displayCoins = ["BTC", "ETH", "SOL"];

  const samplePrices = [
    { symbol: "BTC", name: "Bitcoin", price_usd: 67420 },
    { symbol: "ETH", name: "Ethereum", price_usd: 3512 },
    { symbol: "SOL", name: "Solana", price_usd: 178.4 },
  ];

  const coinsToShow = (
    prices && prices.length > 0 ? prices : samplePrices
  ).filter((c) => displayCoins.includes(c.symbol.toUpperCase()));

  return (
    <div className="border-b border-border/40 bg-surface-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-6 py-2 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
            <TrendingUp className="w-3.5 h-3.5 text-crypto-green" />
            <span className="font-medium uppercase tracking-wider">
              Live Prices
            </span>
          </div>
          <div className="h-4 w-px bg-border/60 shrink-0" />
          {isLoading ? (
            <div className="flex gap-6">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-5 w-28 bg-surface-3" />
              ))}
            </div>
          ) : (
            <div className="flex gap-6">
              {coinsToShow.map((coin) => {
                const sym = coin.symbol.toUpperCase();
                const colorClass = COIN_COLORS[sym] || "text-foreground";
                const icon = COIN_ICONS[sym] || coin.symbol;
                return (
                  <div
                    key={coin.symbol}
                    className="flex items-center gap-2 shrink-0"
                    data-ocid={`prices.${sym.toLowerCase()}.card`}
                  >
                    <span
                      className={`font-mono font-bold text-sm ${colorClass}`}
                    >
                      {icon}
                    </span>
                    <span className="text-xs font-medium text-foreground/80">
                      {sym}
                    </span>
                    <span className="font-mono text-xs font-semibold text-foreground">
                      ${formatPrice(coin.price_usd)}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
          <div className="ml-auto shrink-0 text-xs text-muted-foreground hidden sm:block">
            Auto-refreshes every 10 min
          </div>
        </div>
      </div>
    </div>
  );
}
