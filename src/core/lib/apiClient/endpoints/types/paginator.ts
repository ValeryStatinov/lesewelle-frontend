export type Paginator = {
  limit: number;
  offset: number;
};

export const DEFAULT_PAGINATOR: Paginator = Object.freeze({
  limit: 20,
  offset: 0,
});

export const searchParamsFromPaginator = (p: Paginator) => {
  const searchParams = new URLSearchParams();

  searchParams.append('limit', p.limit.toString());
  searchParams.append('offset', p.offset.toString());

  return searchParams;
};
