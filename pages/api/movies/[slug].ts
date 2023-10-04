import type { NextApiRequest, NextApiResponse } from 'next';

import movieJson from '@/json/movies.json';

import { getQueryParamAsString, delay } from '@/lib/utils';

// returns a movie from the JSON file via a match on its slug property
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const slug = getQueryParamAsString(req.query.slug);
  const movie = movieJson.find((movie) => movie.slug === slug);

  // Simulate delay in response
  await delay(1000);

  if (!movie) {
    res.status(404).json({ error: 'Movie not found' });
    return;
  }

  res.status(200).json(movie);
}
