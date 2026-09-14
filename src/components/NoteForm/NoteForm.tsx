import { ErrorMessage, Field, Form, Formik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import css from "./NoteForm.module.css";
import type { Note } from "../../types/note";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addNote } from "../../services/noteService";
interface NoteFormProps {
  closeModal: () => void;
}
export default function NoteForm({ closeModal }: NoteFormProps) {
  interface FormValues {
    title: string;
    content: string;
    tag: Note["tag"];
  }

  const initialValues: FormValues = {
    title: "",
    content: "",
    tag: "Todo",
  };
  const NoteFormValues = Yup.object().shape({
    title: Yup.string().min(3).max(50).required(),
    content: Yup.string().max(500),
    tag: Yup.string().oneOf([
      "Todo",
      "Work",
      "Personal",
      "Meeting",
      "Shopping",
    ]),
  });
  const queryClient = useQueryClient();
  const { mutate } = useMutation({
    mutationFn: addNote,
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["note"] });
      closeModal();
    },
  });
  const handlerSubmit = (
    value: FormValues,
    actions: FormikHelpers<FormValues>,
  ) => {
    mutate(value);
    actions.resetForm();
  };
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handlerSubmit}
      validationSchema={NoteFormValues}>
      <Form className={css.form}>
        <div className={css.formGroup}>
          <label htmlFor="title">Title</label>
          <Field
            id="title"
            type="text"
            name="title"
            className={css.input}
          />
          <ErrorMessage
            component={"span"}
            name="title"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="content">Content</label>
          <Field
            as="textarea"
            id="content"
            name="content"
            rows={8}
            className={css.textarea}
          />
          <ErrorMessage
            component={"span"}
            name="content"
            className={css.error}
          />
        </div>

        <div className={css.formGroup}>
          <label htmlFor="tag">Tag</label>
          <Field
            as="select"
            id="tag"
            name="tag"
            className={css.select}>
            <option value="Todo">Todo</option>
            <option value="Work">Work</option>
            <option value="Personal">Personal</option>
            <option value="Meeting">Meeting</option>
            <option value="Shopping">Shopping</option>
          </Field>
          <ErrorMessage
            component={"span"}
            name="tag"
            className={css.error}
          />
        </div>

        <div className={css.actions}>
          <button
            type="button"
            className={css.cancelButton}
            onClick={closeModal}>
            Cancel
          </button>
          <button
            type="submit"
            className={css.submitButton}
            disabled={false}>
            Create note
          </button>
        </div>
      </Form>
    </Formik>
  );
}
