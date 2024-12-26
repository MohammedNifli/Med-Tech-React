import React, { useEffect } from 'react';
import { Button, ButtonGroup, Center, Input } from '@chakra-ui/react';
import usePagination from '../../hooks/usePagination';

interface PaginationProps<T> {
  items: T[];
  pageLimit: number;
  setPageItems: (items: T[]) => void;
}

const Pagination = <T,>({ items, pageLimit, setPageItems }: PaginationProps<T>) => {
  const { pageNumber, changePage, pageData, nextPage, previousPage } = usePagination(items, pageLimit);

  useEffect(() => {
    setPageItems(pageData());
  }, [pageNumber, setPageItems, pageData]);

  return (
    <React.Fragment>
      <Center mt={4}>
        <ButtonGroup spacing="4">
          <Button
            onClick={previousPage}
            disabled={pageNumber === 0}
            colorScheme="blue"
            variant="outline"
          >
            Prev
          </Button>
          <Input
            value={pageNumber}
            onChange={(e) => changePage(Number(e.target.value) || 0)}
            type="number"
            min={0}
            max={Math.ceil(items.length / pageLimit) - 1}
            width="50px"
            textAlign="center"
          />
          <Button
            onClick={nextPage}
            disabled={pageNumber >= Math.ceil(items.length / pageLimit) - 1}
            colorScheme="blue"
            variant="outline"
          >
            Next
          </Button>
        </ButtonGroup>
      </Center>
    </React.Fragment>
  );
};

export default Pagination;
