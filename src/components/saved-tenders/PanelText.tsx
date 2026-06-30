import type { ElementType } from "react";
import { hyphenatedTextContent } from "../../utils/germanTextWrap";

interface PanelTextProps {
  children: string;
  as?: ElementType;
  className?: string;
}

export function PanelText({
  children,
  as: Tag = "p",
  className = "",
}: PanelTextProps) {
  return (
    <Tag className={`break-hyphenate ${className}`.trim()}>
      {hyphenatedTextContent(children)}
    </Tag>
  );
}
