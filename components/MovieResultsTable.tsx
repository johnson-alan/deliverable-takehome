import { useContext, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';

import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button';
import LoadingOverlay from '@/components/LoadingOverlay';
import MovieResultsCount from '@/components/MovieResultsCount';
import ErrorAlert from '@/components/ErrorAlert';

import { SearchContext } from '@/lib/contexts/SearchContext';
import useWindowSize from '@/lib/hooks/useWindowSize';
import useSyncedQueryState from '@/lib/hooks/useSyncedQueryState';
import { constructQueryString, truncateDescription } from '@/lib/utils';

import { MovieResponse } from '@/types/movie';
import { Filters} from '@/types/filters';

const TABLET_BREAKPOINT = 768;
const DESKTOP_BREAKPOINT = 1024;

const PARSE_ERROR_MESSAGE = 'Query not parseable';
const NO_RESULTS_MESSAGE = 'No movies found';

const PARSE_ERROR_USER_MESSAGE = "We couldn't understand your search query. Please try a different one.";
const NO_RESULTS_USER_MESSAGE = "No results found for your search query. Please try a different one.";

export const MovieResultsTable = () => {
  const router = useRouter();

  // The current state of the filters, limit, and page query params, synced with the URL query params
  const {
    filters,
    limit,
    page,
    setFilters,
    setPage,
    queryStateInitialized,
  } = useSyncedQueryState();

  // The string the user has entered into the search input and submitted
  const { search } = useContext(SearchContext);

  // Query to determine applicable filters via AI based on search input
  // Query will only run if the user has entered a search query
  const { data: aiFilters, error: aiError, isFetching: isAIRouteFetching } = useQuery<Filters, Error>(
    ['filters', search],
    async ({ queryKey }) => {
      const [_key, search] = queryKey;
      const response = await fetch('/api/ai', {
        method: 'POST',
        body: JSON.stringify({ query: search }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    {
      enabled: !!search,
    }
  );

  useEffect(() => {
    if (aiFilters) {
      setFilters(aiFilters);
      setPage(0); // Reset page to 0 when filters change
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiFilters]);

  // Dependent query to fetch paginated movie results
  // This query will rerun whenever the filters, limit, or page state changes
  type MovieQueryKey = ['movies', Filters, number, number];
  const { error, data: movieData, isInitialLoading, isFetching } = useQuery<MovieResponse, Error, MovieResponse, MovieQueryKey>(
    ['movies', filters, limit, page],
    async ({ queryKey }) => {
      const [_key, filters, limit, page] = queryKey;
      const queryString = constructQueryString(filters, limit, page);
      const response = await fetch(`/api/movies${queryString}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error);
      return data;
    },
    {
      // We don't want to run the query until all of the query state is initialized
      enabled: queryStateInitialized && !isAIRouteFetching,
      // When we paginate, we want to keep the previous data around so we can show it while
      // the next page of data is loading
      keepPreviousData: true,
    }
  );

  // Avoid long descriptions making table rows awkwardly tall at certain viewports via text truncation
  const { width } = useWindowSize();
  const shouldTruncateDescription = !!width && width > TABLET_BREAKPOINT && width < DESKTOP_BREAKPOINT;

  const getNextPage = () => setPage(page + 1);
  const getPreviousPage = () => setPage(page - 1);

  // If the user's search query is not parseable by the AI, we should let them know the issue
  // is their query, not the app, and they can try again with a different query if they want.
  //
  // Likewise, if the user's search query returns no results, we should let them know that
  // the query was successful with no results, but they can try again with a different query.
  const userAIError = aiError?.message === PARSE_ERROR_MESSAGE ? PARSE_ERROR_USER_MESSAGE : '';
  const noResultsError = error?.message === NO_RESULTS_MESSAGE ? NO_RESULTS_USER_MESSAGE : '';

  if (error || aiError) return <ErrorAlert errorMessage={userAIError || noResultsError} />;

  // @TODO - Adapt loading logic so that it meets the following criteria:
  //
  // Show loading overlays when it will be natural for the user to see them
  //  - when the user is waiting for the initial page of results to load
  //  - when the user is waiting for the next page of results to load
  //  - when a search query has been submitted and the user is waiting for results
  // Avoid showing loading overlays when stale cache data exists and is being refetched
  //  - when user clicks Previous button (or Next button after hitting Previous button)
  //  - When the user navigates back from a detail page
  const showLoadingOverlay = isInitialLoading || isAIRouteFetching || isFetching;

  return (
    <div className='h-full relative'>
      {showLoadingOverlay && <LoadingOverlay />}
      {!isInitialLoading && (
        <Table className="w-[800px] md:w-full h-full">
          <TableHeader className="sticky top-0 z-40 bg-white shadow-bottom-only">
            <TableRow>
              <TableHead></TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Year</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {movieData?.movies.map((movie) => {
              const navigateToDetail = () => router.push(`/movies/${movie.slug}`);
              return (
              <TableRow
                key={movie.slug}
                onClick={navigateToDetail}
                className="hover:bg-yellow-100/20 cursor-pointer group"
              >
                <TableCell className="font-medium min-w-[100px]">
                  <Image
                    src={movie.thumbnail}
                    alt={movie.title}
                    width={100}
                    height={100}
                    className="border-solid border border-gray-200 drop-shadow-md transform transition-transform group-hover:scale-110 group-hover:drop-shadow-lg"
                  />
                </TableCell>
                <TableCell>{movie.title}</TableCell>
                <TableCell>{movie.year}</TableCell>
                <TableCell>{movie.genres.join(', ')}</TableCell>
                <TableCell>
                  {truncateDescription(
                    movie.description,
                    shouldTruncateDescription ? 200 : Number.POSITIVE_INFINITY,
                  )}
                </TableCell>
              </TableRow>
            )})}
          </TableBody>
          <TableFooter className='h-20' />
        </Table>
      )}
      <div
        className="w-screen text-sm text-muted-foreground flex items-center justify-center absolute bottom-0 bg-white shadow-top-only py-2 px-6 sm:px-6 lg:px-24">
        <div className="flex items-center justify-between basis-[1280px]">
          <MovieResultsCount total={movieData?.total} page={page} limit={limit} loading={showLoadingOverlay} />
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={getPreviousPage}
              disabled={page === 0}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={getNextPage}
              disabled={(movieData?.total ?? 0) < page * limit + limit}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
};

