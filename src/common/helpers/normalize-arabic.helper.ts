const ARABIC_CHAR_MAP: Record<string, string> = {
  أ: 'ا',
  إ: 'ا',
  آ: 'ا',
  ٱ: 'ا',
  ؤ: 'و',
  ئ: 'ى',
  ة: 'ه',
};

const ARABIC_DIACRITICS_REGEX = /[\u064B-\u0652]/g;
const ARABIC_TATWEEL_REGEX = /\u0640/g;
const EASTERN_ARABIC_NUMBERS_REGEX = /[٠١٢٣٤٥٦٧٨٩]/g;
const EASTERN_TO_WESTERN_NUMBERS: Record<string, string> = {
  '٠': '0',
  '١': '1',
  '٢': '2',
  '٣': '3',
  '٤': '4',
  '٥': '5',
  '٦': '6',
  '٧': '7',
  '٨': '8',
  '٩': '9',
};
const ARABIC_LETTER_REGEX = /[\u0600-\u06FF]/;

export function normalizeArabicText(value: string): string {
  if (!value || !ARABIC_LETTER_REGEX.test(value)) {
    return value;
  }

  let normalized = value.normalize('NFC');

  normalized = normalized
    .replace(ARABIC_DIACRITICS_REGEX, '')
    .replace(ARABIC_TATWEEL_REGEX, '')
    .replace(
      EASTERN_ARABIC_NUMBERS_REGEX,
      (digit) => EASTERN_TO_WESTERN_NUMBERS[digit] ?? digit,
    )
    .replace(/[أإآٱؤئةى]/g, (char) => ARABIC_CHAR_MAP[char] ?? char);

  return normalized;
}

function shouldSkipNormalization(value: unknown): boolean {
  if (value === null || value === undefined) return true;

  if (value instanceof Date) return true;
  if (typeof Buffer !== 'undefined' && value instanceof Buffer) return true;

  return false;
}

export function normalizeArabicDeep<T>(input: T): T {
  if (typeof input === 'string') {
    return normalizeArabicText(input) as unknown as T;
  }

  if (Array.isArray(input)) {
    for (let index = 0; index < input.length; index++) {
      input[index] = normalizeArabicDeep(input[index]);
    }
    return input;
  }

  if (input && typeof input === 'object') {
    if (shouldSkipNormalization(input)) {
      return input;
    }

    for (const key of Object.keys(input as Record<string, unknown>)) {
      const target = (input as Record<string, unknown>)[key];
      (input as Record<string, unknown>)[key] = normalizeArabicDeep(target);
    }
    return input;
  }

  return input;
}
