const avatar = (filename: string) =>
  `${import.meta.env.BASE_URL}avatars/${filename}`;

export const USER_AVATAR_URLS: Record<string, string> = {
  "Kat Schwarz": avatar("kat-schwarz.jpg"),
  "John Smith": avatar("john-smith.jpg"),
  "Marie Volker": avatar("marie-volker.jpg"),
  "Max Waltz": avatar("max-waltz.jpg"),
  "Johan Stein": avatar("johan-stein.jpg"),
};

export function getUserAvatarUrl(name: string): string | undefined {
  return USER_AVATAR_URLS[name];
}
