/**
 * Local text anonymizer (used by <Anonymizer>). Pure functions, no DOM,
 * no storage, no network: the text only ever lives in memory.
 *
 * Structured data is replaced first, with private-use sentinels, so a
 * later "words to replace" pass can never match inside a placeholder.
 * Sentinels are turned into the localized placeholders at the very end.
 */

export type AnonKind = 'email' | 'phone' | 'iban' | 'cf' | 'card' | 'number';

export const ANON_KINDS: AnonKind[] = ['email', 'phone', 'iban', 'cf', 'card', 'number'];

export interface AnonPlaceholders {
  email: string;
  phone: string;
  iban: string;
  cf: string;
  card: string;
  number: string;
  /** Template with `{n}`, e.g. "[NOME {n}]". */
  name: string;
}

export interface AnonResult {
  text: string;
  counts: Record<AnonKind | 'name', number>;
}

const OPEN = '';
const CLOSE = '';
const KIND_BASE = 0xe010;
// Name index digits are encoded as private-use chars too (no ASCII digits
// inside a sentinel, so numbers/terms can never match it).
const DIGIT_BASE = 0xe100;
const NAME_MARK = String.fromCharCode(0xe020);

const encodeIndex = (n: number) =>
  String(n)
    .split('')
    .map((d) => String.fromCharCode(DIGIT_BASE + Number(d)))
    .join('');
const decodeIndex = (s: string) =>
  s
    .split('')
    .map((c) => c.charCodeAt(0) - DIGIT_BASE)
    .join('');

const EMAIL = /(?<![A-Z0-9._%+-])[A-Z0-9._%+-]{1,64}@[A-Z0-9-]+(?:\.[A-Z0-9-]+)*\.[A-Z]{2,}/gi;
// Country code + 2 check digits + 11 to 30 alphanumerics, optionally in
// groups of 4 separated by single spaces. Uppercase only, to avoid words.
const IBAN = /\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){2,7}(?: ?[A-Z0-9]{1,3})?\b/g;
// Codice fiscale, including the "omocodia" variant (digits swapped for
// the letters LMNPQRSTUV).
const CODICE_FISCALE =
  /\b[A-Z]{6}[\dLMNP-V]{2}[A-EHLMPR-T][\dLMNP-V]{2}[A-Z][\dLMNP-V]{3}[A-Z]\b/gi;
// 13 to 19 digits: either contiguous, or three groups of 4 plus the rest.
const CARD =
  /\b\d{4}(?:[ -]?\d{4}){2}[ -]?\d{1,7}\b|\b\d{4}[ -]\d{6}[ -]\d{5}\b|\b\d{13,19}\b/g;
// International: + or 00, country code, then digit groups.
const PHONE_INTL = /(?<![\w+])(?:\+|00)\d{1,3}(?:[ .-]?\(?\d{1,4}\)?){2,5}(?!\d)/g;
// Italian mobile without prefix: 3xx xxx xxxx.
const PHONE_IT_MOBILE = /(?<![\w.,/+-])3\d{2}[ .-]?\d{3}[ .-]?\d{3,4}(?!\d)/g;
// Italian landline: 0 + area code, then 5 to 8 digits in up to two groups.
const PHONE_IT_LANDLINE = /(?<![\w.,/+-])0\d{1,3}[ ./-]?\d{3,4}[ .-]?\d{2,4}(?!\d)/g;
const ANY_NUMBER = /\d+(?:[.,]\d+)*/g;

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function sentinel(kind: AnonKind): string {
  return OPEN + String.fromCharCode(KIND_BASE + ANON_KINDS.indexOf(kind)) + CLOSE;
}

function digitCount(s: string): number {
  return (s.match(/\d/g) || []).length;
}

/** Parse the "words to replace" field: comma or newline separated, deduped. */
export function parseTerms(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const piece of raw.split(/[,\n;]/)) {
    const term = piece.trim().replace(/\s+/g, ' ');
    if (!term) continue;
    const key = term.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(term);
  }
  return out;
}

export function anonymize(
  input: string,
  options: { terms: string[]; allNumbers: boolean; placeholders: AnonPlaceholders },
): AnonResult {
  const counts: AnonResult['counts'] = {
    email: 0,
    phone: 0,
    iban: 0,
    cf: 0,
    card: 0,
    number: 0,
    name: 0,
  };
  let text = input;

  const apply = (
    re: RegExp,
    kind: AnonKind,
    validate?: (match: string) => boolean,
  ) => {
    text = text.replace(re, (match) => {
      if (validate && !validate(match)) return match;
      counts[kind] += 1;
      return sentinel(kind);
    });
  };

  apply(EMAIL, 'email');
  apply(IBAN, 'iban');
  apply(CODICE_FISCALE, 'cf');
  apply(CARD, 'card');
  const phoneOk = (m: string) => {
    const n = digitCount(m);
    return n >= 8 && n <= 15;
  };
  apply(PHONE_INTL, 'phone', phoneOk);
  apply(PHONE_IT_MOBILE, 'phone', phoneOk);
  apply(PHONE_IT_LANDLINE, 'phone', phoneOk);
  if (options.allNumbers) apply(ANY_NUMBER, 'number');

  // Words to replace: longest first, so "Mario Rossi" wins over "Mario".
  // The number follows the order the reader typed them.
  const indexed = options.terms.map((term, i) => ({ term, n: i + 1 }));
  const byLength = [...indexed].sort((a, b) => b.term.length - a.term.length);
  for (const { term, n } of byLength) {
    const re = new RegExp(
      `(?<![\\p{L}\\p{N}])${escapeRegExp(term).replace(/ /g, '\\s+')}(?![\\p{L}\\p{N}])`,
      'giu',
    );
    text = text.replace(re, () => {
      counts.name += 1;
      return `${OPEN}${NAME_MARK}${encodeIndex(n)}${CLOSE}`;
    });
  }

  const { placeholders } = options;
  text = text.replace(
    new RegExp(`${OPEN}([\\uE010-\\uE015])${CLOSE}`, 'g'),
    (_, c: string) => placeholders[ANON_KINDS[c.charCodeAt(0) - KIND_BASE]],
  );
  text = text.replace(
    new RegExp(`${OPEN}${NAME_MARK}([\\uE100-\\uE109]+)${CLOSE}`, 'g'),
    (_, d: string) => placeholders.name.replace('{n}', decodeIndex(d)),
  );

  return { text, counts };
}
