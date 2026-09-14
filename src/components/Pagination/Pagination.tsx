import ReactPaginate from "react-paginate";
import css from "./Pagination.module.css";

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
