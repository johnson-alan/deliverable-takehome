// This Next.js index file redirects from / to /movies?limit=25&page=0
const Index = () => null;

export const getServerSideProps = async () => {
  return {
    redirect: {
      destination: '/movies?limit=25&page=0',
      permanent: false,
    },
  }
}

export default Index;
