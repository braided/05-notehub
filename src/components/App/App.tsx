import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; 
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox"; 
import Modal from "../Modal/Modal"; 
import NoteForm from "../NoteForm/NoteForm"; 
import type { Note } from "../../types/note"; // Глобальний тип Note (без локальних інтерфейсів)
import css from "./App.module.css"; 

// Описуємо структуру того, що повертає ваше API (масив нотаток та загальна кількість для розрахунку сторінок)
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

  // 1. Debounced-пошуковий запит (300мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Скидаємо на першу сторінку при зміні пошукового запиту
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // 2. Отримання даних за допомогою TanStack Query з урахуванням параметрів у queryKey та getNotes
  // Властивість placeholderData забезпечує безшовну пагінацію без стрибків екрана
  const { data, isLoading, isError } = useQuery<NotesResponse | Note[]>({
    queryKey: ["note", { search: debouncedSearch, page: currentPage }],
    queryFn: () => getNotes(debouncedSearch, currentPage), 
    placeholderData: keepPreviousData, 
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  // 3. Безпечно витягуємо чистий масив Note[] залежно від структури відповіді вашого API
  const notesList: Note[] = Array.isArray(data) 
    ? data 
    : data && typeof data === "object" && "data" in data && Array.isArray(data.data)
      ? data.data
      : [];

  // 4. Отримуємо загальну кількість елементів із сервера або за довжиною масиву
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

      {/* Передаємо нотатки без жодних приведень до types/never */}
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

      {/* Рендериться компонент Modal та NoteForm */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
