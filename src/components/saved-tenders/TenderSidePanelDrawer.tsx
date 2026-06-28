import { useEffect } from "react";
import { TenderSidePanel } from "./TenderSidePanel";
import type { TenderPanelView } from "../../types/tender";

interface TenderSidePanelDrawerProps {
  tender: TenderPanelView | null;
  isOpen: boolean;
  onClose: () => void;
  onClosed: () => void;
}

export function TenderSidePanelDrawer({
  tender,
  isOpen,
  onClose,
  onClosed,
}: TenderSidePanelDrawerProps) {
  useEffect(() => {
    if (!isOpen && tender) {
      const timer = window.setTimeout(onClosed, 300);
      return () => window.clearTimeout(timer);
    }
  }, [isOpen, onClosed, tender]);

  if (!tender) {
    return null;
  }

  return (
    <>
      <button
        type="button"
        aria-label="Seitenleiste schließen"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-transparent transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
      />

      <div
        className={`fixed inset-y-0 right-0 z-50 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <TenderSidePanel tender={tender} onClose={onClose} />
      </div>
    </>
  );
}
