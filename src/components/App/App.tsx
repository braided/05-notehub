import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getNotes } from "../../services/noteService"; 
import NoteList from "../NoteList/NoteList";
import Pagination from "../Pagination/Pagination";
import css from "./App.module.css"; 

// Захисний інтерфейс на випадок, якщо тип Note не імпортувався глобально
interface BaseNote {
  id: string;
  title: string;
  content: string;
  tag?: string;
  [key: string]: unknown;
}

export default function App() {
  const [currentPage, setCurrentPage] = useState<number>(0);
  const notesPerPage = 6; 

  // Отримуємо дані з сервера через useQuery
  const { data: rawData, isLoading, isError } = useQuery({
    queryKey: ["note"],
    queryFn: getNotes,
  });

  if (isLoading) return <div className={css.loader || ""}>Loading...</div>;
  if (isError) return <div className={css.error || ""}>Error loading notes.</div>;

  // ГАРАНТІЯ СТАБІЛЬНОСТІ: перевіряємо, чи повернувся масив. 
  // Якщо сервер повернув об'єкт (наприклад, { data: [...] }), дістаємо масив із нього.
  const notes: BaseNote[] = Array.isArray(rawData) 
    ? rawData 
    : (rawData && typeof rawData === "object" && "data" in rawData && Array.isArray((rawData as { data: unknown }).data))
      ? ((rawData as { data: BaseNote[] }).data)
      : [];

  // Розрахунок пагінації
  const totalPages = Math.ceil(notes.length / notesPerPage);
  const indexOfLastNote = (currentPage + 1) * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className={css.appContainer || ""}>
      <header className={css.header || ""}>
        <h1>Notehub</h1>
      </header>

      {/* Приведення типу до any, щоб TypeScript не сварився, якщо інтерфейси в NoteList відрізняються */}
      <NoteList notes={currentNotes as never} />

      {totalPages > 1 && (
        <div className={css.paginationWrapper || ""}>
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
