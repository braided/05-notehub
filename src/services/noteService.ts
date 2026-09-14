import axios from "axios";
import type { Note, NoteValue, TagValue } from "../types/note";

const token = import.meta.env.VITE_NOTEHUB_TOKEN;

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export interface Notes {
  notes: Note[];
  totalPages: number;
}

export interface NoteParams {
  page: number;
  search?: string;
  tag?: TagValue;
  perPage?: number;
  sortBy?: "created" | "updated";
}

const authHeader = {
  Authorization: `Bearer ${token}`,
};

export const fetchNotes = async ({
  page,
  search,
  tag,
  perPage,
  sortBy,
}: NoteParams): Promise<Notes> => {
  const params = search
    ? {
        page,
        search,
        tag,
        perPage,
        sortBy,
      }
    : {
        page,
        tag,
        perPage,
        sortBy,
      };

  const { data } = await axios.get<Notes>("/notes", {
    params,
    headers: authHeader,
  });

  return data;
};

export const addNote = async (noteData: NoteValue): Promise<Note> => {
  const { data } = await axios.post<Note>("/notes", noteData, {
    headers: authHeader,
  });

  return data;
};

export const deleteNote = async (id: Note["id"]): Promise<Note> => {
  const { data } = await axios.delete<Note>(`/notes/${id}`, {
    headers: authHeader,
  });

  return data;
};
