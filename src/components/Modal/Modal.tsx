import { createPortal } from "react-dom";
import css from "./Modal.module.css";
import type React from "react";

import { useEffect } from "react";

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
}
export default function Modal({ onClose, children }: ModalProps) {
  const close = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  useEffect(() => {
    const handlerKeyDown = (e: KeyboardEvent) => {
      if (e.code === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handlerKeyDown);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handlerKeyDown);
    };
  }, [onClose]);
  return createPortal(
    <div
      className={css.backdrop}
      role="dialog"
      aria-modal="true"
      onClick={close}>
      <div className={css.modal}>
        <button
          type="button"
          className={css.closeBtn}
          onClick={onClose}>
          x
        </button>
        {children}
      </div>
    </div>,
    document.getElementById("modal-root") as HTMLDivElement,
  );
}
