export const PROGRAMMING_LANGUAGES = [
  'JavaScript',
  'Python',
  'Java',
  'TypeScript',
  'C++',
  'C#',
  "C",
  'Go',
  'Rust',
  'R',
] as const

export type ProgrammingLanguage = (typeof PROGRAMMING_LANGUAGES)[number]

