import type { NextApiRequest, NextApiResponse } from 'next';

import movieJson from '@/json/movies.json';

import { getQueryParamAsArray, getQueryParamAsString, delay } from '@/lib/utils';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const genres = getQueryParamAsArray(req.query['genres[]']); // qs stringfies array params as `genres[]`
  const startYear = getQueryParamAsString(req.query.startYear);
  const endYear = getQueryParamAsString(req.query.endYear);
  const limit = parseInt(getQueryParamAsString(req.query.limit) || '25'); // Default limit to 25 if not provided
  const page = parseInt(getQueryParamAsString(req.query.page) || '0'); // Default page to 0 if not provided

  const filteredMovies = movieJson
    .filter(movie => (genres?.length ? genres.some(genre => movie.genres.includes(genre)) : true))
    .filter(movie => (startYear ? movie.year >= parseInt(startYear) : true))
    .filter(movie => (endYear ? movie.year <= parseInt(endYear) : true));

  const skip = page * limit;

  if (skip > filteredMovies.length) {
    res.status(404).json({ error: 'Limit exceeded' });
    return;
  }

  const paginatedMovies = filteredMovies.slice(skip, skip + limit); // Apply skip and limit for pagination

  if (paginatedMovies.length === 0) {
    res.status(404).json({ error: 'No movies found' });
    return;
  }

  // Simulate delay in response
  await delay(1000);

  res.status(200).json({ movies: paginatedMovies, total: filteredMovies.length });
};
