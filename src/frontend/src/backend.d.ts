import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface http_request_result {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export interface Coin {
    name: string;
    price_usd: number;
    symbol: string;
}
export interface TransformationOutput {
    status: bigint;
    body: Uint8Array;
    headers: Array<http_header>;
}
export type Time = bigint;
export interface TransformationInput {
    context: Uint8Array;
    response: http_request_result;
}
export interface Article {
    url: string;
    title: string;
    source: string;
    body: string;
    published_on: Time;
    imageurl: string;
}
export interface http_header {
    value: string;
    name: string;
}
export interface backendInterface {
    getArticlesBySources(sources: Array<string>): Promise<Array<Article>>;
    getArticlesSince(timestamp: Time): Promise<Array<Article>>;
    getCoinBySymbol(symbol: string): Promise<Coin | null>;
    getNews(): Promise<Array<Article>>;
    getNewsByKeyword(keyword: string): Promise<Array<Article>>;
    getNewsBySource(source: string): Promise<Array<Article>>;
    getPrices(): Promise<Array<Coin>>;
    getTopArticles(count: bigint): Promise<Array<Article>>;
    transform(input: TransformationInput): Promise<TransformationOutput>;
}
