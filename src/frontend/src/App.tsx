import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AlertCircle, Newspaper, RefreshCw, Zap } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { NewsCard } from "./components/NewsCard";
import { NewsCardSkeleton } from "./components/NewsCardSkeleton";
import { PriceBar } from "./components/PriceBar";
import { useGetNews } from "./hooks/useQueries";

const queryClient = new QueryClient();

const CATEGORIES = [
  "All",
  "Bitcoin",
  "Ethereum",
  "DeFi",
  "Altcoins",
  "NFT",
  "Regulation",
];

const SKELETON_KEYS = ["sk-1", "sk-2", "sk-3", "sk-4", "sk-5", "sk-6"];

const SAMPLE_ARTICLES = [
  {
    url: "https://example.com/1",
    title:
      "Bitcoin Surges Past $67,000 as Institutional Demand Reaches New Highs",
    source: "CoinDesk",
    body: "Bitcoin has reached a new multi-month high as institutional investors continue to pour capital into spot Bitcoin ETFs, with BlackRock and Fidelity recording record inflows this week.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 3600),
    imageurl: "/assets/generated/crypto-news-btc.dim_600x340.jpg",
  },
  {
    url: "https://example.com/2",
    title: "Ethereum's Pectra Upgrade Set to Transform Network Scalability",
    source: "The Block",
    body: "The upcoming Ethereum Pectra upgrade promises significant improvements to validator UX, account abstraction, and blob throughput, potentially reducing Layer 2 fees by up to 90%.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 7200),
    imageurl: "/assets/generated/crypto-news-eth.dim_600x340.jpg",
  },
  {
    url: "https://example.com/3",
    title: "DeFi Total Value Locked Climbs Back to $100 Billion Milestone",
    source: "DeFi Pulse",
    body: "Decentralized finance protocols have collectively reclaimed the $100 billion TVL mark, driven by renewed interest in liquid staking derivatives and yield farming strategies across Ethereum and Solana.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 10800),
    imageurl: "/assets/generated/crypto-news-defi.dim_600x340.jpg",
  },
  {
    url: "https://example.com/4",
    title: "NFT Market Shows Signs of Recovery with $500M Monthly Volume",
    source: "NFT Now",
    body: "The NFT market is showing promising signs of recovery, with monthly trading volume reaching $500 million for the first time since 2022, led by gaming assets and digital collectibles.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 14400),
    imageurl: "/assets/generated/crypto-news-nft.dim_600x340.jpg",
  },
  {
    url: "https://example.com/5",
    title:
      "SEC Approves New Crypto Regulatory Framework for Digital Asset Exchanges",
    source: "Reuters",
    body: "The Securities and Exchange Commission has greenlit a comprehensive regulatory framework for digital asset exchanges, providing much-needed clarity for institutional market participants.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 18000),
    imageurl: "/assets/generated/crypto-news-regulation.dim_600x340.jpg",
  },
  {
    url: "https://example.com/6",
    title:
      "Solana Breaks Transaction Record with 100,000 TPS During Meme Coin Frenzy",
    source: "Decrypt",
    body: "Solana network achieved a historic milestone, processing over 100,000 transactions per second during a surge in meme coin activity, showcasing the network's raw throughput capabilities.",
    published_on: BigInt(Math.floor(Date.now() / 1000) - 21600),
    imageurl: "/assets/generated/crypto-news-btc.dim_600x340.jpg",
  },
];

function NewsGrid({ category }: { category: string }) {
  const {
    data: articles,
    isLoading,
    isError,
    refetch,
  } = useGetNews(category === "All" ? null : category);

  const displayArticles =
    articles && articles.length > 0 ? articles : SAMPLE_ARTICLES;

  if (isError) {
    return (
      <div
        data-ocid="news.error_state"
        className="flex flex-col items-center justify-center py-24 gap-4"
      >
        <AlertCircle className="w-12 h-12 text-destructive" />
        <p className="text-muted-foreground text-sm">
          Failed to load news. Please try again.
        </p>
        <Button
          data-ocid="news.retry_button"
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          className="border-crypto-blue/50 text-crypto-blue hover:bg-crypto-blue/10"
        >
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div
        data-ocid="news.loading_state"
        className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {SKELETON_KEYS.map((key) => (
          <NewsCardSkeleton key={key} />
        ))}
      </div>
    );
  }

  if (displayArticles.length === 0) {
    return (
      <div
        data-ocid="news.empty_state"
        className="flex flex-col items-center justify-center py-24 gap-3"
      >
        <Newspaper className="w-12 h-12 text-muted-foreground" />
        <p className="text-muted-foreground text-sm">
          No articles found for this category.
        </p>
      </div>
    );
  }

  return (
    <motion.div
      data-ocid="news.list"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <AnimatePresence mode="popLayout">
        {displayArticles.map((article, i) => (
          <motion.div
            key={article.url}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <NewsCard article={article} index={i} />
          </motion.div>
        ))}
      </AnimatePresence>
    </motion.div>
  );
}

function AppContent() {
  const [activeCategory, setActiveCategory] = useState("All");

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border/40 bg-surface-1/95 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/crypto-logo-transparent.dim_80x80.png"
                alt="CryptoDaily logo"
                className="w-9 h-9 object-contain"
              />
              <div>
                <h1 className="font-display font-bold text-lg tracking-tight leading-none">
                  <span className="text-crypto-blue">Crypto</span>
                  <span className="text-foreground">Daily</span>
                </h1>
                <p className="text-xs text-muted-foreground hidden sm:block">
                  {today}
                </p>
              </div>
            </div>

            {/* Live badge */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-crypto-green">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-crypto-green opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-crypto-green" />
                </span>
                <span className="font-medium hidden sm:inline">LIVE</span>
              </div>
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <Zap className="w-3 h-3 text-crypto-gold" />
                <span className="hidden md:inline">Powered by IC</span>
              </div>
            </div>
          </div>
        </div>

        {/* Price Bar */}
        <PriceBar />
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        {/* Category Tabs */}
        <div className="mb-6">
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList
              data-ocid="news.filter.tab"
              className="bg-surface-2 border border-border/40 p-1 h-auto flex-wrap gap-1 w-full sm:w-auto"
            >
              {CATEGORIES.map((cat) => (
                <TabsTrigger
                  key={cat}
                  value={cat}
                  data-ocid={`news.${cat.toLowerCase()}.tab`}
                  className="text-xs px-3 py-1.5 data-[state=active]:bg-crypto-blue data-[state=active]:text-surface-1 data-[state=active]:shadow-glow-blue rounded-md transition-all"
                >
                  {cat}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Section heading */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-display font-semibold text-lg text-foreground">
              {activeCategory === "All"
                ? "Latest News"
                : `${activeCategory} News`}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">{today}</p>
          </div>
        </div>

        <NewsGrid category={activeCategory} />
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-surface-1 py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()}. Built with{" "}
            <span className="text-crypto-red">♥</span> using{" "}
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-crypto-blue hover:underline"
            >
              caffeine.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
