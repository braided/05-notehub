import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; 
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css"; 

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const notesPerPage = 6; 

  const { data: notes = [], isLoading, isError } = useQuery({
    queryKey: ["note"],
    queryFn: getNotes,
  });

  if (isLoading) return <div className={css.loader}>Loading...</div>;
  if (isError) return <div className={css.error}>Error loading notes.</div>;

  const totalPages = Math.ceil(notes.length / notesPerPage);

  const indexOfLastNote = (currentPage + 1) * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className={css.appContainer}>
      <header className={css.header}>
        <h1>Notehub</h1>
      </header>

      <NoteList notes={currentNotes} />

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
