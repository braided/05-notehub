import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; // Перевірте, чи правильний шлях до вашого сервісу
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css"; // Або ваші стилі для App

export default function App() {
  // 1. Стейт сторінки на базі 0-індексації (перша сторінка — це 0)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const notesPerPage = 6; // Скільки нотаток відображати на одній сторінці

  // 2. Запит до React Query (залиште вашу логіку queryKey та queryFn як було)
  const { data: notes = [], isLoading, isError } = useQuery({
    queryKey: ["note"],
    queryFn: getNotes,
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  // 3. Розрахунок кількості сторінок
  const totalPages = Math.ceil(notes.length / notesPerPage);

  // 4. Фільтрація нотаток для поточної сторінки
  const indexOfLastNote = (currentPage + 1) * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className={css.appContainer}>
      <header className={css.header}>
        <h1>Notehub</h1>
      </header>

      {/* Передаємо списку ТІЛЬКИ нотатки для поточної сторінки */}
      <NoteList notes={currentNotes} />

      {/* Рендеримо пагінацію з новими пропсами, якщо сторінок більше ніж 1 */}
      {totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
            forcePage={currentPage}
            pageCount={totalPages}
          />
        </div>
      )}
    </div>
  );
}
