interface CheckboxProps {
  checked?: boolean;
  onChange?: (checked: boolean) => void;
  label?: string;
}

export function Checkbox({ checked = false, onChange, label }: CheckboxProps) {
  return (
    <label className="inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange?.(event.target.checked)}
        className="size-4 cursor-pointer rounded-[2px] border border-border-dark accent-accent-primary"
        aria-label={label ?? "Zeile auswählen"}
      />
    </label>
  );
}
