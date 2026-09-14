import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; 
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox"; 
import Modal from "../Modal/Modal"; 
import NoteForm from "../NoteForm/NoteForm"; 
import type { Note } from "../../types/note"; 
import css from "./App.module.css"; 

// Описуємо інтерфейс відповіді від сервера відповідно до стандартів пагінації
interface NotesResponse {
  data: Note[];
  total: number;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const notesPerPage = 6; 

  // Ефект для реалізації debounced-пошуку
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Скидаємо на першу сторінку при кожному новому пошуку
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Запит за допомогою TanStack Query враховує параметри в queryKey та передає їх у getNotes.
  // Параметр placeholderData забезпечує безшовне перемикання сторінок.
  const { data, isLoading, isError } = useQuery<NotesResponse | Note[]>({
    queryKey: ["note", { search: debouncedSearch, page: currentPage }],
    queryFn: () => getNotes(debouncedSearch, currentPage), 
    placeholderData: keepPreviousData, 
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  // Визначаємо масив нотаток на основі структури даних, яку повернув сервер
  const notesList: Note[] = Array.isArray(data) 
    ? data 
    : data && typeof data === "object" && "data" in data && Array.isArray(data.data)
      ? data.data
      : [];

  // Визначаємо загальну кількість нотаток для коректного прорахунку кількості сторінок
  const totalItems = data && typeof data === "object" && "total" in data && typeof data.total === "number"
    ? data.total
    : notesList.length;

  const totalPages = Math.ceil(totalItems / notesPerPage);

  return (
    <div className={css.appContainer}>
      <header className={css.header}>
        <h1>Notehub</h1>
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          Add Note
        </button>
      </header>

      {/* Рендериться компонент SearchBox для пошуку */}
      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      {/* Передаємо список нотаток без небезпечних приведень до типу never */}
      <NoteList notes={notesList} />

      {/* Рендериться компонент пагінації */}
      {totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
            forcePage={currentPage}
            pageCount={totalPages}
          />
        </div>
      )}

      {/* Рендериться модальне вікно та форма створення нотатки */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
