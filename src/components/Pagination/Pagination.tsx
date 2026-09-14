import type { ComponentType } from "react";
import ReactPaginateModule from "react-paginate";
import type { ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<ComponentType<ReactPaginateProps>>
).default;

interface PaginationProps {
  onPageChange: (selectedPage: number) => void;
  pageCount: number;
  forcePage: number;
}

export default function Pagination({
  onPageChange,
  pageCount,
  forcePage,
}: PaginationProps) {
  return (
    <ReactPaginate
      onPageChange={({ selected }) => onPageChange(selected)}
      forcePage={forcePage}
      pageRangeDisplayed={3}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="< previous"
      nextLabel="next >"
    />
  );
  
}
