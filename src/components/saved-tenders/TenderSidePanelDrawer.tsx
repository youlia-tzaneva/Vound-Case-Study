import { useEffect } from "react";
import { TenderSidePanel } from "./TenderSidePanel";
import type {
  TenderPanelView,
  TenderQualification,
  TenderSidebarUpdates,
} from "../../types/tender";
import type { VoteType } from "../../utils/applyVote";

interface TenderSidePanelDrawerProps {
  tender: TenderPanelView | null;
  userVote: VoteType | null;
  isOpen: boolean;
  onClose: () => void;
  onClosed: () => void;
  onTenderUpdate: (tenderId: string, updates: TenderSidebarUpdates) => void;
  onVote: (tenderId: string, type: VoteType, qualification: TenderQualification) => void;
}

export function TenderSidePanelDrawer({
  tender,
  userVote,
  isOpen,
  onClose,
  onClosed,
  onTenderUpdate,
  onVote,
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
        className={`fixed inset-y-0 right-0 z-50 flex h-screen transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <TenderSidePanel
          tender={tender}
          userVote={userVote}
          onClose={onClose}
          onUpdate={(updates) => onTenderUpdate(tender.id, updates)}
          onVote={(type, qualification) =>
            onVote(tender.id, type, qualification)
          }
        />
      </div>
    </>
  );
}
