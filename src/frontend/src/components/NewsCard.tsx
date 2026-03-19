import { Badge } from "@/components/ui/badge";
import { Clock, ExternalLink } from "lucide-react";
import type { Article } from "../backend";

const FALLBACK_IMAGES: Record<string, string> = {
  bitcoin: "/assets/generated/crypto-news-btc.dim_600x340.jpg",
  btc: "/assets/generated/crypto-news-btc.dim_600x340.jpg",
  ethereum: "/assets/generated/crypto-news-eth.dim_600x340.jpg",
  eth: "/assets/generated/crypto-news-eth.dim_600x340.jpg",
  defi: "/assets/generated/crypto-news-defi.dim_600x340.jpg",
  nft: "/assets/generated/crypto-news-nft.dim_600x340.jpg",
  regulation: "/assets/generated/crypto-news-regulation.dim_600x340.jpg",
};

function getFallbackImage(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();
  for (const [key, img] of Object.entries(FALLBACK_IMAGES)) {
    if (text.includes(key)) return img;
  }
  return "/assets/generated/crypto-news-btc.dim_600x340.jpg";
}

function formatDate(published_on: bigint): string {
  const ms = Number(published_on) * 1000;
  const date = new Date(ms);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffH = Math.floor(diffMs / (1000 * 60 * 60));
  const diffM = Math.floor(diffMs / (1000 * 60));
  if (diffM < 60) return `${diffM}m ago`;
  if (diffH < 24) return `${diffH}h ago`;
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function detectCategory(title: string, body: string): string {
  const text = `${title} ${body}`.toLowerCase();
  if (text.includes("bitcoin") || text.includes(" btc")) return "Bitcoin";
  if (text.includes("ethereum") || text.includes(" eth ")) return "Ethereum";
  if (text.includes("defi") || text.includes("decentralized finance"))
    return "DeFi";
  if (text.includes("nft") || text.includes("non-fungible")) return "NFT";
  if (text.includes("regulat") || text.includes("sec ") || text.includes("law"))
    return "Regulation";
  return "Altcoins";
}

const CATEGORY_COLORS: Record<string, string> = {
  Bitcoin: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  Ethereum: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  DeFi: "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
  NFT: "bg-pink-500/20 text-pink-400 border-pink-500/30",
  Regulation: "bg-red-500/20 text-red-400 border-red-500/30",
  Altcoins: "bg-green-500/20 text-green-400 border-green-500/30",
};

interface NewsCardProps {
  article: Article;
  index: number;
}

export function NewsCard({ article, index }: NewsCardProps) {
  const category = detectCategory(article.title, article.body);
  const imgSrc =
    article.imageurl || getFallbackImage(article.title, article.body);

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      data-ocid={`news.item.${index + 1}`}
      className="group block rounded-lg overflow-hidden bg-surface-2 card-gradient-border cursor-pointer transition-all duration-300 hover:scale-[1.01] hover:shadow-card-hover"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video overflow-hidden bg-surface-3">
        <img
          src={imgSrc}
          alt={article.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          onError={(e) => {
            const target = e.currentTarget;
            target.src = getFallbackImage(article.title, article.body);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-surface-2 via-transparent to-transparent" />
        <div
          className={`absolute top-3 left-3 text-xs px-2 py-0.5 rounded-full border font-body font-medium ${CATEGORY_COLORS[category]}`}
        >
          {category}
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-display font-semibold text-sm leading-snug text-foreground line-clamp-2 mb-2 group-hover:text-crypto-blue transition-colors">
          {article.title}
        </h3>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3 leading-relaxed">
          {article.body}
        </p>
        <div className="flex items-center justify-between">
          <Badge
            variant="outline"
            className="text-xs border-border/60 text-muted-foreground bg-surface-3 px-2 py-0 h-5"
          >
            {article.source}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            <span>{formatDate(article.published_on)}</span>
            <ExternalLink className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
        </div>
      </div>
    </a>
  );
}
