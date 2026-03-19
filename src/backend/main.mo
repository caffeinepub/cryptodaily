import Time "mo:core/Time";
import Int "mo:core/Int";
import Array "mo:core/Array";
import Text "mo:core/Text";
import OutCall "http-outcalls/outcall";
import Order "mo:core/Order";

actor {
  // Type definitions
  type Article = {
    title : Text;
    body : Text;
    source : Text;
    url : Text;
    imageurl : Text;
    published_on : Time.Time;
  };

  type Coin = {
    name : Text;
    symbol : Text;
    price_usd : Float;
  };

  // CryptoCompare news cache (15 minutes)
  var newsCache : ?{
    data : [Article];
    timestamp : Time.Time;
  } = null;

  // CoinGecko prices cache (5 minutes)
  var pricesCache : ?{
    data : [Coin];
    timestamp : Time.Time;
  } = null;

  module Article {
    public func compare(a : Article, b : Article) : Order.Order {
      Int.compare(b.published_on, a.published_on);
    };
  };

  func parseArticles(json : Text) : [Article] {
    // Placeholder for actual parsing logic (JSON parsing to be handled in frontend)
    Array.empty<Article>();
  };

  func parseCoins(json : Text) : [Coin] {
    // Placeholder for actual parsing logic (JSON parsing to be handled in frontend)
    Array.empty<Coin>();
  };

  public query ({ caller }) func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };

  // Fetch news with caching
  public shared ({ caller }) func getNews() : async [Article] {
    let now = Time.now();
    let fifteenMinutes = 15 * 60 * 1000000000; // 15 minutes in nanoseconds

    switch (newsCache) {
      case (?cache) {
        if (now - cache.timestamp < fifteenMinutes) {
          return cache.data;
        };
      };
      case (null) {};
    };

    let response = await OutCall.httpGetRequest(
      "https://min-api.cryptocompare.com/data/v2/news/?lang=EN",
      [], // Additional headers if needed
      transform,
    );

    // Parse response (actual parsing to be handled in frontend)
    let articles = parseArticles(response);

    // Update cache
    newsCache := ?{
      data = articles;
      timestamp = now;
    };

    articles;
  };

  // Fetch prices with caching
  public shared ({ caller }) func getPrices() : async [Coin] {
    let now = Time.now();
    let fiveMinutes = 5 * 60 * 1000000000; // 5 minutes in nanoseconds

    switch (pricesCache) {
      case (?cache) {
        if (now - cache.timestamp < fiveMinutes) {
          return cache.data;
        };
      };
      case (null) {};
    };

    let response = await OutCall.httpGetRequest(
      "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd",
      [], // Additional headers if needed
      transform,
    );

    // Parse response (actual parsing to be handled in frontend)
    let coins = parseCoins(response);

    // Update cache
    pricesCache := ?{
      data = coins;
      timestamp = now;
    };

    coins;
  };

  // Get news by source
  public shared ({ caller }) func getNewsBySource(source : Text) : async [Article] {
    let news = await getNews();
    let filtered = news.filter(
      func(article) { article.source == source }
    );
    filtered.sort();
  };

  // Get news by keyword in title or body
  public shared ({ caller }) func getNewsByKeyword(keyword : Text) : async [Article] {
    let news = await getNews();
    let filtered = news.filter(
      func(article) {
        article.title.contains(#text keyword) or article.body.contains(#text keyword)
      }
    );
    filtered.sort();
  };

  // Get articles published after a certain timestamp
  public shared ({ caller }) func getArticlesSince(timestamp : Time.Time) : async [Article] {
    let news = await getNews();
    let filtered = news.filter(
      func(article) { article.published_on > timestamp }
    );
    filtered.sort();
  };

  // Get coin by symbol
  public shared ({ caller }) func getCoinBySymbol(symbol : Text) : async ?Coin {
    let coins = await getPrices();
    coins.find(
      func(coin) { coin.symbol == symbol }
    );
  };

  // Get top N articles
  public shared ({ caller }) func getTopArticles(count : Nat) : async [Article] {
    let news = await getNews();
    news.sliceToArray(0, if (news.size() < count) { news.size() } else { count });
  };

  // Get articles by multiple sources
  public shared ({ caller }) func getArticlesBySources(sources : [Text]) : async [Article] {
    let news = await getNews();
    let filtered = news.filter(
      func(article) {
        sources.foldLeft(
          false,
          func(acc, source) {
            acc or (article.source == source);
          },
        );
      }
    );
    filtered.sort();
  };
};
