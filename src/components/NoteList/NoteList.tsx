import { useState } from "react";
import type { Note } from "../../types/note";
import css from "./NoteList.module.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteNote } from "../../services/noteService";
import Pagination from "../Pagination/Pagination"; // Перевірте правильність відносного шляху

interface NoteListProps {
  notes: Note[];
}

export default function NoteList({ notes }: NoteListProps) {
  const queryClient = useQueryClient();
  
  // 1. Додаємо стейт поточної сторінки (0-індексація)
  const [currentPage, setCurrentPage] = useState<number>(0);
  const notesPerPage = 6; // Скільки нотаток показувати на одній сторінці
  
  const totalPages = Math.ceil(notes.length / notesPerPage);

  const { mutate } = useMutation({
    mutationFn: deleteNote,
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["note"],
      });
      // Якщо після видалення на поточній сторінці не залишилося нотаток (і це не перша сторінка)
      const isLastItemOnPage = (notes.length - 1) % notesPerPage === 0;
      if (isLastItemOnPage && currentPage > 0) {
        setCurrentPage((prev) => prev - 1);
      }
    },
  });

  const handlerDelete = (id: Note["id"]) => {
    mutate(id);
  };

  // 2. Обчислюємо, які саме нотатки показати на поточній сторінці
  const indexOfLastNote = (currentPage + 1) * notesPerPage;
  const indexOfFirstNote = indexOfLastNote - notesPerPage;
  const currentNotes = notes.slice(indexOfFirstNote, indexOfLastNote);

  return (
    <div className={css.container}>
      <ul className={css.list}>
        {/* Рендеримо тільки відфільтровані для цієї сторінки нотатки (currentNotes) */}
        {currentNotes.map((note) => {
          return (
            <li
              className={css.listItem}
              key={note.id}>
              <h2 className={css.title}>{note.title}</h2>
              <p className={css.content}>{note.content}</p>
              <div className={css.footer}>
                <span className={css.tag}>{note.tag}</span>
                <button
                  className={css.button}
                  onClick={() => handlerDelete(note.id)}>
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>

      {/* 3. Рендеримо пагінацію, якщо сторінок більше ніж одна */}
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
