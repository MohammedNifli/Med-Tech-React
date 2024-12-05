import { useState } from 'react';

function usePagination<T>(items: T[], pageLimit: number) {
  const [pageNumber, setPageNumber] = useState(0);
  const pageCount = Math.ceil(items.length / pageLimit);

  const changePage = (pN: number) => {
    setPageNumber(Math.max(0, Math.min(pN, pageCount - 1)));
  };

  const pageData = () => {
    const start = pageNumber * pageLimit;
    const end = start + pageLimit;
    return items.slice(start, end);
  };

  const nextPage = () => {
    setPageNumber(Math.min(pageNumber + 1, pageCount - 1));
  };

  const previousPage = () => {
    setPageNumber(Math.max(pageNumber - 1, 0));
  };

  return { pageNumber, pageCount, changePage, pageData, nextPage, previousPage };
}

export default usePagination;
