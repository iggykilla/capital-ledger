import type { CsvTable } from './types'

const countDelimiter = (line: string, delimiter: ',' | ';') => {
  let count = 0
  let quoted = false
  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    if (char === '"') {
      if (quoted && line[index + 1] === '"') {
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (!quoted && char === delimiter) {
      count += 1
    }
  }
  return count
}

export const detectDelimiter = (text: string): ',' | ';' => {
  const firstLine = text.replace(/^\uFEFF/, '').split(/\r?\n/).find((line) => line.trim().length > 0) ?? ''
  return countDelimiter(firstLine, ';') > countDelimiter(firstLine, ',') ? ';' : ','
}

export const parseCsv = (input: string): CsvTable => {
  const text = input.replace(/^\uFEFF/, '')
  const delimiter = detectDelimiter(text)
  const rows: string[][] = []
  let row: string[] = []
  let field = ''
  let quoted = false

  const pushField = () => {
    row.push(field)
    field = ''
  }

  const pushRow = () => {
    pushField()
    if (row.some((value) => value.length > 0)) rows.push(row)
    row = []
  }

  for (let index = 0; index < text.length; index += 1) {
    const char = text[index]
    if (char === '"') {
      if (quoted && text[index + 1] === '"') {
        field += '"'
        index += 1
      } else {
        quoted = !quoted
      }
    } else if (!quoted && char === delimiter) {
      pushField()
    } else if (!quoted && (char === '\n' || char === '\r')) {
      if (char === '\r' && text[index + 1] === '\n') index += 1
      pushRow()
    } else {
      field += char
    }
  }

  if (field.length > 0 || row.length > 0) pushRow()

  const [headers = [], ...dataRows] = rows
  return {
    delimiter,
    headers: headers.map((header) => header.trim()),
    rows: dataRows,
  }
}

export const parseLocaleNumber = (value: string | undefined): number | undefined => {
  const raw = value?.trim()
  if (!raw) return undefined

  const normalized = raw
    .replace(/\s/g, '')
    .replace(/(?<=\d)[.](?=\d{3}(?:\D|$))/g, '')
    .replace(',', '.')

  const parsed = Number(normalized)
  return Number.isFinite(parsed) ? parsed : undefined
}
