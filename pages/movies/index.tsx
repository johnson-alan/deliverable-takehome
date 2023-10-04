import { MovieResultsTable } from '@/components/MovieResultsTable';
import { NextPageContext } from 'next';

const Movies = () => <MovieResultsTable />;

export const getServerSideProps = async (ctx: NextPageContext) => {
  // conditionally redirect to '/movies?limit=25&page=0' if the user visits the bare '/movies' URL
  if (ctx.query && Object.keys(ctx.query).length === 0) {
    return {
      redirect: {
        destination: '/movies?limit=25&page=0',
        permanent: false,
      },
    };
  } else {
    return { props: {} }
  }
}

export default Movies;
