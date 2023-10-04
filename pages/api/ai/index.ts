import type { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import { createLanguageModel, createJsonTranslator } from 'typechat';

import { FilterResponse } from '@/types/filters';

// This is extra context we'll append to the user's search string before sending it to the TypeChat API.
// In testing, searching for, e.g., "1967 thrillers" returned `genres: ["thrillers"]`
// instead of ["Thriller"], which would make matching on the JSON data trickier and brittle.
//
// Alternatively, we could have added a Genre type and used it in the Filters type, but the README
// advises not to modify the types, so we'll just append this text to the user's query instead.
const ADDITIONAL_CONTEXT =
  "(Note: Genre strings should be singular, not plural, and capitalized.)";

const model = createLanguageModel(process.env);
const schema = fs.readFileSync('./types/filters.ts', 'utf-8');
const translator = createJsonTranslator<FilterResponse>(model, schema, 'FilterResponse');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {

  // we only accept POST method at this endpoint
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const userFilterText = req.body.query;

  // Ensure req.body.query exists
  if (!userFilterText) {
    return res.status(400).json({ error: 'Missing search query' });
    return;
  }

  // Ensure req.body.query is a plain string
  if (typeof req.body.query !== 'string') {
    res.status(400).json({ error: 'Query should be a plain string' });
    return;
  }

  // Ensure req.body.query is not empty
  if (req.body.query.trim() === '') {
    res.status(400).json({ error: 'Query should not be empty' });
    return;
  }

  // The TypeChat API will convert the user's query into a Filters object
  const response = await translator.translate(`${userFilterText} ${ADDITIONAL_CONTEXT}`);

  // In this case, the call to `translate` failed for some reason.
  // This is either an internal TypeChat error or an error passed along from the OpenAI API
  // We probably don't want to show this to the user directly.
  if (!response.success) {
    res.status(500).json({ error: `TypeChat responded with error: ${response.message}` });
    return;
  }

  // In this case, the call to `translate` succeeded, but the user-submitted query was not parseable.
  // We probably want to tell the user that their query was not understood and to try again.
  if (response.data.error) {
    res.status(400).json({ error: 'Query not parseable' });
    return;
  }

  // Sometimes, for queries like "1940s movies", the TypeChat API will return a `genres` array
  // with a single element, "Movie" or "Film", which are not valid genres. We'll filter those out here.
  const invalidGenres = ['Movie', 'Film'];
  if (response.data.filters?.genres) {
    response.data.filters.genres = response.data.filters.genres.filter(genre => !invalidGenres.includes(genre));
  }

  res.status(200).json(response.data.filters);
}
