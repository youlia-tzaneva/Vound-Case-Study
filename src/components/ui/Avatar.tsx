import { getUserAvatarUrl } from "../../data/userAvatars";

interface AvatarProps {
  name?: string;
  initials: string;
  color: string;
  avatarUrl?: string;
  size?: number;
  className?: string;
}

export function Avatar({
  name,
  initials,
  color,
  avatarUrl,
  size = 20,
  className = "",
}: AvatarProps) {
  const resolvedUrl = avatarUrl ?? (name ? getUserAvatarUrl(name) : undefined);

  if (resolvedUrl) {
    return (
      <img
        src={resolvedUrl}
        alt={name ? `${name} Profilbild` : "Profilbild"}
        width={size}
        height={size}
        className={`inline-block shrink-0 rounded-full object-cover ${className}`}
      />
    );
  }

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
