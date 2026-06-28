import { ChevronRight } from "lucide-react";
import { withIconClass } from "./iconProps";

interface TextLinkProps {
  children: string;
  href?: string;
  onClick?: () => void;
}

export function TextLink({ children, href = "#", onClick }: TextLinkProps) {
  return (
    <a
      href={href}
      onClick={(event) => {
        if (onClick) {
          event.preventDefault();
          onClick();
        }
      }}
      className="inline-flex items-center gap-4xs text-table text-text-accent underline decoration-solid underline-offset-2"
    >
      {children}
      <ChevronRight {...withIconClass()} />
    </a>
  );
}
