# CryptoDaily News

## Current State
New project with no existing application files.

## Requested Changes (Diff)

### Add
- Daily crypto news feed fetched via HTTP outcalls from a public crypto news API
- News article cards with title, summary, source, category tag, and timestamp
- Category filter bar (All, Bitcoin, Ethereum, Altcoins, DeFi, NFT, Regulation)
- Trending coins sidebar with current prices fetched via HTTP outcalls
- Auto-refresh mechanism to keep news current
- Article click-through to original source
- Simple admin-free public read interface

### Modify
N/A (new project)

### Remove
N/A (new project)

## Implementation Plan
1. Select `http-outcalls` component for backend HTTP fetch capability
2. Generate Motoko backend with:
   - fetchCryptoNews(): fetches headlines from CryptoCompare or similar public API
   - fetchTrendingPrices(): fetches BTC, ETH, BNB, SOL, XRP prices
   - Cached results with TTL to avoid excessive outcalls
3. Build React frontend with:
   - Header with app name and current date
   - Category filter tabs
   - Responsive news card grid
   - Trending prices sidebar
   - Loading states and error handling
