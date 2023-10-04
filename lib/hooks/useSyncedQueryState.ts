import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

import { constructQueryString } from "@/lib/utils";

import { Filters } from "@/types/filters";

const useSyncedQueryState = () => {
  const router = useRouter();

  const [filters, setFilters] = useState<Filters>({});
  const [limit, setLimit] = useState<number>(25);
  const [page, setPage] = useState<number>(0);

  const [queryStateInitialized, setQueryStateInitialized] = useState(false);

  const parseQuery = (query: ParsedUrlQuery) => {
    const { limit, page, ...restFilters } = query;

    // qs stringfies array params as `genres[]`, so we need to convert them back to `genres`
    if (restFilters['genres[]']) {
      restFilters.genres = restFilters['genres[]'];
      delete restFilters['genres[]'];
    }

    return {
      limit: Number(limit) || 25,
      page: Number(page) || 0,
      filters: {
        genres: restFilters.genres ? (Array.isArray(restFilters.genres) ? restFilters.genres : [restFilters.genres]) : undefined,
        startYear: restFilters.startYear ? Number(restFilters.startYear) : undefined,
        endYear: restFilters.endYear ? Number(restFilters.endYear) : undefined,
      }
    };
  };

  // Read the initial query params and set the state
  useEffect(() => {
    const { limit, page, filters } = parseQuery(router.query);
    setLimit(limit);
    setPage(page);
    setFilters(filters);
    setQueryStateInitialized(true);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reflect changes in state to URL
  useEffect(() => {
    if (!queryStateInitialized) return;
    const queryString = constructQueryString(filters, limit, page);

    if (router.asPath !== `/movies${queryString}`) {
      router.push(`/movies${queryString}`, undefined, { shallow: true });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, limit, page]);

  // Reflect changes in URL to state (deep linking)
  useEffect(() => {
    const { limit, page, filters } = parseQuery(router.query);
    setLimit(limit);
    setPage(page);
    setFilters(filters);
  }, [router.query]);

  return {
    filters,
    limit,
    page,
    setFilters,
    setLimit,
    setPage,
    queryStateInitialized,
  };
};

export default useSyncedQueryState;
