import {
  BookMarked,
  BookOpen,
  Building2,
  LineChart,
  Search,
  Shield,
  Sparkles,
  Trophy,
  Wrench,
} from "lucide-react";
import { withIconClass } from "../ui/iconProps";

const navItems: Array<{
  id: string;
  icon: typeof Search;
  label: string;
  active?: boolean;
}> = [
  { id: "search", icon: Search, label: "Suche" },
  { id: "projects", icon: Wrench, label: "Projekte", active: true },
  { id: "library", icon: BookOpen, label: "Bibliothek" },
  { id: "company", icon: Building2, label: "Unternehmen" },
  { id: "awards", icon: Trophy, label: "Auszeichnungen" },
  { id: "saved", icon: BookMarked, label: "Gespeichert" },
  { id: "analytics", icon: LineChart, label: "Analysen" },
  { id: "ai", icon: Sparkles, label: "KI" },
  { id: "admin", icon: Shield, label: "Administration" },
];

export function AppSidebar() {
  return (
    <nav
      aria-label="Hauptnavigation"
      className="relative flex h-full shrink-0 flex-col items-center gap-m border-r border-border-dark bg-bg-containers px-s py-m"
    >
      {navItems.map(({ id, icon: Icon, label, active }) => (
        <button
          key={id}
          type="button"
          aria-label={label}
          aria-current={active ? "page" : undefined}
          className={`relative flex size-6 items-center justify-center rounded-container transition-colors ${
            active ? "text-icon-selected" : "text-icon-default hover:text-icon-hover"
          }`}
        >
          {active && (
            <span
              aria-hidden
              className="absolute -left-[13px] size-[50px] rounded-container bg-bg-light"
            />
          )}
          <Icon {...withIconClass("relative z-10")} size={20} />
        </button>
      ))}
    </nav>
  );
}
