import { Fragment, type ReactNode } from "react";

const LONG_WORD_MIN_LENGTH = 18;

/** German compound second parts — longest first for correct matching. */
const COMPOUND_BOUNDARIES = [
  "instandsetzung",
  "modernisierung",
  "unterhaltung",
  "unternehmer",
  "planung",
  "leistung",
  "gebäude",
  "verfahren",
  "sanierung",
  "errichtung",
  "entwicklung",
  "wartung",
  "montage",
];

const WORD_TOKEN_RE = /[\wäöüÄÖÜß]+|[^\wäöüÄÖÜß]+|\s+/g;

function insertCompoundSoftHyphen(word: string): string | null {
  const lower = word.toLowerCase();
  let bestIndex = -1;

  for (const part of COMPOUND_BOUNDARIES) {
    const idx = lower.indexOf(part);
    if (idx >= 4 && idx < word.length - 3 && (bestIndex === -1 || idx < bestIndex)) {
      bestIndex = idx;
    }
  }

  if (bestIndex > 0) {
    return `${word.slice(0, bestIndex)}\u00AD${word.slice(bestIndex)}`;
  }

  return null;
}

function renderWord(token: string, index: number): ReactNode {
  if (token.length < LONG_WORD_MIN_LENGTH) {
    return <Fragment key={index}>{token}</Fragment>;
  }

  const hyphenated = insertCompoundSoftHyphen(token);
  if (hyphenated) {
    return <Fragment key={index}>{hyphenated}</Fragment>;
  }

  return (
    <span key={index} className="break-hyphenate-auto">
      {token}
    </span>
  );
}

export function hyphenatedTextContent(text: string): ReactNode {
  const tokens = text.match(WORD_TOKEN_RE) ?? [text];

  return tokens.map((token, index) => {
    if (/^[\wäöüÄÖÜß]+$/.test(token)) {
      return renderWord(token, index);
    }

    return <Fragment key={index}>{token}</Fragment>;
  });
}
