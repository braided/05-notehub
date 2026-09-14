import ReactPaginateModule, { type ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
).default;

interface PaginationProps {
  handlePageClick: (nextPage: number) => void;
  pageCount: number;
  currentPage: number;
}
export default function Pagination({
  handlePageClick,
  pageCount,
  currentPage,
}: PaginationProps) {
  return (
    <ReactPaginate
      onPageChange={({ selected }) => handlePageClick(selected + 1)}
      forcePage={currentPage - 1}
      pageRangeDisplayed={pageCount}
      pageCount={pageCount}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="< previous"
      nextLabel="next >"
    />
  );
}
