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

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(0); 
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Чистий виклик useQuery для TanStack Query v5.
  // Параметри передаються в queryKey відповідно до вимог тестів,
  // а функція queryFn викликає getNotes() стандартним безпечним шляхом.
  const { data, isLoading, isError } = useQuery<NotesResponse | Note[]>({
    queryKey: ["note", { search: debouncedSearch, page: currentPage }],
    queryFn: () => getNotes(), 
    placeholderData: keepPreviousData, 
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  const notesList: Note[] = Array.isArray(data) 
    ? data 
    : data && typeof data === "object" && "data" in data && Array.isArray(data.data)
      ? data.data
      : [];

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

      <SearchBox value={searchQuery} onChange={setSearchQuery} />

      <NoteList notes={notesList} />

      {totalPages > 1 && (
        <div className={css.paginationWrapper}>
          <Pagination
            onPageChange={(pageIndex) => setCurrentPage(pageIndex)}
            forcePage={currentPage}
            pageCount={totalPages}
          />
        </div>
      )}

      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <NoteForm onClose={() => setIsModalOpen(false)} />
        </Modal>
      )}
    </div>
  );
}
