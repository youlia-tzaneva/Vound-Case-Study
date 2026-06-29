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
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={label ?? "Zeile auswählen"}
      disabled={disabled}
      onMouseDown={(event) => event.preventDefault()}
      onClick={() => onChange?.(!checked)}
      className={`inline-flex items-center border-0 bg-transparent p-0 ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
    >
      <Icon
        {...withIconClass(
          checked ? "text-icon-selected" : disabled ? "text-icon-disabled" : undefined,
        )}
      />
    </button>
  );
}
