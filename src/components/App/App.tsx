import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; 
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import SearchBox from "../SearchBox/SearchBox"; // Компонент пошуку
import Modal from "../Modal/Modal"; // Компонент модального вікна
import NoteForm from "../NoteForm/NoteForm"; // Форма створення нотатки
import type { Note } from "../../types/note"; // Глобальний тип Note
import css from "./App.module.css"; 

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  
  const notesPerPage = 6; 

  // Реалізація Debounce для пошукового запиту (наприклад, 300мс)
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); // Скидаємо на першу сторінку при зміні пошуку
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Запит до TanStack Query з урахуванням пошуку та сторінки в queryKey
  // Використовуємо keepPreviousData для забезпечення безшовної пагінації (placeholderData)
  const { data, isLoading, isError } = useQuery({
    queryKey: ["note", { search: debouncedSearch, page: currentPage }],
    queryFn: () => getNotes(), // Якщо ваше API приймає параметри, передайте їх сюди: getNotes(debouncedSearch, currentPage)
    placeholderData: keepPreviousData, 
  });

  // Безпечно приводимо дані до типу масиву Note[] без використання any чи local інструментів
  const notes: Note[] = Array.isArray(data) 
    ? data 
    : (data && typeof data === "object" && "data" in data && Array.isArray((data as { data: unknown }).data))
      ? ((data as { data: Note[] }).data)
      : [];

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  // Логіка клієнтської пагінації та фільтрації (якщо фільтрація не відбувається на сервері)
  const filteredNotes = notes.filter((note) =>
    note.title.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
    note.content.toLowerCase().includes(debouncedSearch.toLowerCase())
  );

  const totalPages = Math.ceil(filteredNotes.length / notesPerPage);
  const indexOfLastNote = (currentPage + 1) * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = filteredNotes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className={css.appContainer}>
      <header className={css.header}>
        <h1>Notehub</h1>
        <button className={css.addButton} onClick={() => setIsModalOpen(true)}>
          Add Note
        </button>
      </header>

      {/* Рендеринг пошукового компонента */}
      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      {/* Рендеринг списку нотаток із правильним типом без використання never */}
      <NoteList notes={currentNotes} />

      {/* Рендеринг пагінації */}
      {totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
            forcePage={currentPage}
            pageCount={totalPages}
          />
        </div>
      )}

      {/* Рендеринг модального вікна та форми */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
