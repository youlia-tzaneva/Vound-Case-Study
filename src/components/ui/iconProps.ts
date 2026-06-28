export const iconClassName = "shrink-0 text-icon-default";

export const iconProps = {
  size: 16,
  strokeWidth: 1,
  absoluteStrokeWidth: true,
  "aria-hidden": true as const,
};

export function withIconClass(className?: string) {
  return {
    ...iconProps,
    className: className ? `${iconClassName} ${className}` : iconClassName,
  };
}
