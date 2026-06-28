import { Square, SquareCheck } from "lucide-react";
import { withIconClass } from "./iconProps";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked = false, onChange, label }: CheckboxProps) {
  const Icon = checked ? SquareCheck : Square;

  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="sr-only"
        aria-label={label ?? "Zeile auswählen"}
      />
      <Icon
        {...withIconClass(checked ? "text-icon-selected" : undefined)}
      />
    </label>
  );
}
