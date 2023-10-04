import { FunctionComponent, useMemo } from "react";

interface Props {
  total?: number;
  page: number;
  limit: number;
  loading?: boolean;
}

const MovieResultsCount: FunctionComponent<Props> = ({ total, page, limit, loading }) => {
  const { cursorStart, cursorEnd } = useMemo(() => {
    const cursorStart = page * limit + 1;
    const cursorEnd = Math.min(page * limit + limit, total ?? 0);

    return { cursorStart, cursorEnd };
  }, [total, page, limit]);

  if (loading) return <div />;

  return (
    <div className="text-sm text-muted-foreground">
      <span className='hidden md:visible'>Showing</span>
      {' '}
      <span className="font-semibold">{cursorStart} - {cursorEnd}</span>
      {' '}
      of
      {' '}
      <span className="font-semibold">{total || 0}</span>
      {' '}
      results
    </div>
  );
}

export default MovieResultsCount;
