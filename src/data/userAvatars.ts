export const USER_AVATAR_URLS: Record<string, string> = {
  "Kat Schwarz": "/avatars/kat-schwarz.jpg",
  "John Smith": "/avatars/john-smith.jpg",
  "Marie Volker": "/avatars/marie-volker.jpg",
  "Max Waltz": "/avatars/max-waltz.jpg",
  "Johan Stein": "/avatars/johan-stein.jpg",
};

export function getUserAvatarUrl(name: string): string | undefined {
  return USER_AVATAR_URLS[name];
}
