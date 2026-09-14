import ReactPaginateModule, { type ReactPaginateProps } from "react-paginate";
import css from "./Pagination.module.css";
import type { ComponentType } from "react";

type ModuleWithDefault<T> = { default: T };

// Коректний імпорт для сумісності з Vite 8.x.x
const ReactPaginate = (
  ReactPaginateModule as unknown as ModuleWithDefault<
    ComponentType<ReactPaginateProps>
  >
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
      pageRangeDisplayed={3} // Кількість видимих кнопок сторінок по центру
      marginPagesDisplayed={1} // Кількість видимих сторінок на початку і в кінці
      pageCount={pageCount}
      containerClassName={css.pagination}
      activeClassName={css.active}
      previousLabel="< previous"
      nextLabel="next >"
    />
  );
}
