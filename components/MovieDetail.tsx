import { useRouter } from 'next/router';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeftIcon } from '@radix-ui/react-icons';

import { Button } from '@/components/ui/button';
import LoadingOverlay from '@/components/LoadingOverlay';
import ErrorAlert from '@/components/ErrorAlert';

import { Movie } from '@/types/movie';

const NO_RESULTS_USER_MESSAGE = "We couldn't find that movie. Please go back and try again";

function MovieDetail() {
  const router = useRouter();
  const { slug } = router.query;

  // @TODO: I think we should be able to access the movie data from the cache without
  // having to make another request to the API, so long as the user navigates from the
  // table. This query should be a fallback in case the user navigates via a bare URL.
  // I was not sure how to accomplish this with the `movies` query cache due to it having
  // different values for pagination and search (?).
  const { data: movie, isLoading, isError } = useQuery<Movie, Error>(
    ['movie', slug],
    async () => {
      const response = await fetch(`/api/movies/${slug}`);
      if (!response.ok) throw new Error('Could not fetch movie');
      return response.json();
    },
    {
      enabled: !!slug,
    }
  );

  if (isError) return <ErrorAlert errorMessage={NO_RESULTS_USER_MESSAGE} />;

  return (
    <div className="flex justify-center p-6 pb-20 relative min-h-full">
      {isLoading
        ?  <LoadingOverlay />
        : (
          <div className="flex flex-col gap-8 flex-1 max-w-7xl">
            <div className="flex flex-row">
              <Button onClick={router.back}>
                <ArrowLeftIcon className="mr-2 h-4 w-4"/> Back
              </Button>
            </div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="flex flex-col">
                <Image
                  src={movie.thumbnail}
                  alt={movie.title}
                  width={movie.thumbnail_width}
                  height={movie.thumbnail_height}
                  className=
                    "border-solid border bg-white border-yellow-400 p-4 drop-shadow-lg transform transition-transform hover:scale-110 hover:drop-shadow-2xl hover:border-2"
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="font-extrabold text-4xl bg-yellow-300 p-2">
                  {movie.title}
                </h1>
                <div className="flex flex-row md:flex-col gap-2">
                  <div className='basis-50 flex-shrink-0'>
                    <span className="font-semibold text-lg bg-yellow-300 px-2">Release Year</span>
                    <p className='ml-2'>{movie.year}</p>
                  </div>
                  <div>
                    <span className="w-full font-semibold text-lg bg-yellow-300 px-2">
                      {movie.genres.length > 1 ? 'Genres' : 'Genre'}
                    </span>
                    <p className='ml-2'>{movie.genres.join(', ')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <p className="font-semibold">Description</p>
              <p>{movie.description}</p>
            </div>
          </div>
        )
      }
    </div>
  );
}

export default MovieDetail;
