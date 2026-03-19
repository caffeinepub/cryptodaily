import { useQuery } from "@tanstack/react-query";
import type { Article, Coin } from "../backend";
import { useActor } from "./useActor";

export function useGetNews(keyword: string | null) {
  const { actor, isFetching } = useActor();
  return useQuery<Article[]>({
    queryKey: ["news", keyword],
    queryFn: async () => {
      if (!actor) return [];
      if (keyword && keyword !== "All") {
        return actor.getNewsByKeyword(keyword);
      }
      return actor.getNews();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    staleTime: 5 * 60 * 1000,
  });
}

export function useGetPrices() {
  const { actor, isFetching } = useActor();
  return useQuery<Coin[]>({
    queryKey: ["prices"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getPrices();
    },
    enabled: !!actor && !isFetching,
    refetchInterval: 10 * 60 * 1000,
    staleTime: 5 * 60 * 1000,
  });
}
