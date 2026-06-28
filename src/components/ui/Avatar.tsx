interface AvatarProps {
  initials: string;
  color: string;
  size?: number;
  className?: string;
}

export function Avatar({
  initials,
  color,
  size = 20,
  className = "",
}: AvatarProps) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full text-tender-title text-text-inverted ${className}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
        fontSize: 14,
      }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
