import { Square, SquareCheck } from "lucide-react";
import { withIconClass } from "./iconProps";

interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
}

export function Checkbox({
  checked = false,
  onChange,
  label,
  disabled = false,
}: CheckboxProps) {
  const Icon = checked ? SquareCheck : Square;

  return (
    <label
      className={`inline-flex items-center ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(event) => onChange?.(event.target.checked)}
        className="sr-only"
        aria-label={label ?? "Zeile auswählen"}
      />
      <Icon
        {...withIconClass(
          checked ? "text-icon-selected" : disabled ? "text-icon-disabled" : undefined,
        )}
      />
    </label>
  );
}
