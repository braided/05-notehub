import axios, { type AxiosResponse } from "axios";

import type { Note, NoteValue, TagValue } from "../types/note";

const api = axios.create({
  baseURL: "https://notehub-public.goit.study/api",
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_NOTEHUB_TOKEN}`,
  },
});

export interface FetchNotesParams {
  page: number;
  perPage: number;
  search?: string;
  tag?: TagValue;
  sortBy?: "created" | "updated";
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  page,
  perPage,
  search,
  tag,
  sortBy,
}: FetchNotesParams): Promise<FetchNotesResponse> => {
  const response: AxiosResponse<FetchNotesResponse> = await api.get(
    "/notes",
    {
      params: {
        page,
        perPage,
        search,
        tag,
        sortBy,
      },
    },
  );

  return response.data;
};

export const createNote = async (noteData: NoteValue): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.post("/notes", noteData);

  return response.data;
};

export const deleteNote = async (id: Note["id"]): Promise<Note> => {
  const response: AxiosResponse<Note> = await api.delete(`/notes/${id}`);

  return response.data;
};