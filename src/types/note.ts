export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: TagValue;
}

export type TagValue = "Todo" | "Work" | "Shopping" | "Meeting" | "Personal";

export interface NoteValue {
  title: string;
  content: string;
  tag: Note["tag"];
}
