# Deliverable Interview Takehome

# Solution

Hosted Solution: [Vercel Deployment](https://deliverable-takehome.vercel.app/)

This is a take-home interview assignment completed in October 2023 for Deliverable as one component of their technical interview process. The solution uses react-query, react-table, and Tailwind for styling. The search functionality is powered by TypeChat, converting natural language serach into query params used to filter the data. All told going from zero UI to the finished solution (which is mobile-first responsive and includes robust loading and error states) took around 6-8 hours of work - AJ.

# Problem

Using the provided Next.js project, implement the following fullstack application:

- An index page that lists all the movies in `/json/movies.json` (assume this is your database)
- A movie details page that displays some information about the selected movie
- An "AI-powered" search that takes a natural language query and translates it to a set of filters to narrow down the results shown in the table.

Creating these three features will require implementing a React UI, as well as implementing the APIs that will power them.

For the AI search, you have been given the [TypeChat](https://microsoft.github.io/TypeChat/) library. The accompanying documentation and [examples](https://microsoft.github.io/TypeChat/docs/examples/) on their GitHub should give you clear direction. You are also provided the Typscript interface for the filters in the `/types` directory. _Being able to describe at a high-level what TypeChat is doing, and how the type files are being used, is important!_

The rest is a choose-your-own-adventure. Use technologies you are comfortable with.

- Use whatever UI library you want, or just use vanilla Tailwind.
- Fetch the data how you want. We like react-query, but it's up to you.

### Example Demo

![Solution demo](demo.gif)
