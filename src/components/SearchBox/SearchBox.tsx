import css from "./SearchBox.module.css";

interface SearchBoxProps {
  query: string;
  updateQuery: (query: string) => void;
}
export default function SearchBox({ query, updateQuery }: SearchBoxProps) {
  return (
    <input
      className={css.input}
      type="text"
      placeholder="Search notes"
      defaultValue={query}
      onChange={(e) => updateQuery(e.target.value)}
    />
  );
}
