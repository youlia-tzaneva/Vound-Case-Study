import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  children: ReactNode;
}

const variantClassNames: Record<ButtonVariant, string> = {
  primary:
    "bg-button-primary-default text-text-inverted hover:bg-button-primary-hover disabled:bg-button-primary-disabled disabled:text-text-disabled",
  secondary:
    "border border-border-dark bg-bg-containers text-button-secondary-default hover:text-button-secondary-hover disabled:text-button-secondary-disabled",
};

export function Button({
  variant = "primary",
  children,
  className = "",
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center rounded-container px-xs py-3xs text-button transition-colors disabled:cursor-not-allowed ${variantClassNames[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
