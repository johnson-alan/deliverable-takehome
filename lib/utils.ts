import { Filters } from "@/types/filters";
import { type ClassValue, clsx } from "clsx"
import qs from "qs";
import { twMerge } from "tailwind-merge"

// This is a catch-all utils file. In a real-world app, we'd probably want to break this up into
// multiple files.

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
};

// Helper function to get query param from Next.js API route (they can be either string or string[])
export const getQueryParamAsString = (param?: string | string[]): string | null => {
  if (!param) return null;
  if (Array.isArray(param)) {
    return param[0];
  }
  return param;
};

// We need a separate query extractor to handle array params, like genres
export const getQueryParamAsArray = (param?: string | string[]): string[] | null => {
  if (!param) return null;
  if (Array.isArray(param)) {
    return param;
  }
  return [param];
};

// Helper function to simulate the delay we'd see in a real-world app sending data over the wire
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const truncateDescription = (description: string, characters: number) => (
  description.length <= characters
    ? description
    : `${description.slice(0, characters).trimEnd()}...`
);

export const constructQueryString = (filters: Filters, limit: number = 25, page: number = 0) => {
  const queryString = qs.stringify({
    ...filters,
    limit,
    page
  }, {
    addQueryPrefix: true,
    arrayFormat: 'brackets',
  });

  return queryString;
};
