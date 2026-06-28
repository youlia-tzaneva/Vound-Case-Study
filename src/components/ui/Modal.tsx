import { useEffect, type ReactNode } from "react";
import { X } from "lucide-react";
import { withIconClass } from "./iconProps";

interface ModalProps {
  isOpen: boolean;
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

export function Modal({ isOpen, title, onClose, children, footer }: ModalProps) {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-xs">
      <button
        type="button"
        aria-label="Dialog schließen"
        onClick={onClose}
        className="absolute inset-0 bg-text-primary/20"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative flex max-h-[calc(100vh-32px)] w-full max-w-[560px] flex-col rounded-container border border-border-light bg-bg-containers"
      >
        <div className="flex items-start justify-between gap-xs px-s py-xs">
          <h2 id="modal-title" className="text-h3 text-text-primary">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Dialog schließen"
            onClick={onClose}
            className="inline-flex shrink-0 items-center justify-center text-icon-default hover:text-icon-hover"
          >
            <X {...withIconClass()} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-s py-xs">{children}</div>

        {footer && (
          <div className="flex items-center justify-end gap-3xs border-t border-border-light px-s py-xs">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
