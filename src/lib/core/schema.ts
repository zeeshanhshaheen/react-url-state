import { z } from 'zod'
import type { UrlStateDefinition, UrlStateOptions, UrlStateSchema, ParsedUrlState } from './types'
import { getFieldType, decodeValue, encodeValue } from './encoders'

export function defineUrlState<T>(
  schema: UrlStateSchema<T>,
  options?: UrlStateOptions
): UrlStateDefinition<T> & {
  readFrom: (searchParams: URLSearchParams | Record<string, string | string[]>) => ParsedUrlState<T>
  toSearchParams: (data: T) => URLSearchParams
} {
  const definition: UrlStateDefinition<T> = {
    schema,
    options: {
      mode: 'replace',
      debounceMs: 0,
      scope: 'search',
      ...options,
    },
  }

  return {
    ...definition,
    readFrom: (searchParams) => parseUrlState(schema, searchParams),
    toSearchParams: (data) => serializeUrlState(schema, data),
  }
}

function parseUrlState<T>(
  schema: UrlStateSchema<T>,
  searchParams: URLSearchParams | Record<string, string | string[]>
): ParsedUrlState<T> {
  const params = searchParams instanceof URLSearchParams 
    ? Object.fromEntries(searchParams.entries()) 
    : searchParams

  const decoded = decodeSearchParams(params, schema)
  const result = schema.safeParse(decoded)

  if (result.success) {
    return { data: result.data }
  }

  const errors: Record<string, string> = {}
  result.error.issues.forEach(issue => {
    const path = issue.path.join('.')
    errors[path] = issue.message
  })

  const defaultResult = schema.safeParse({})
  return {
    data: defaultResult.success ? defaultResult.data : {} as T,
    errors,
  }
}

function serializeUrlState<T>(schema: UrlStateSchema<T>, data: T): URLSearchParams {
  const searchParams = new URLSearchParams()
  encodeToSearchParams(data, searchParams, schema)
  return searchParams
}

function decodeSearchParams(params: Record<string, string | string[]>, schema: UrlStateSchema): any {
  const decoded: any = {}

  for (const [key, value] of Object.entries(params)) {
    const typeInfo = getFieldType(schema, key)
    decoded[key] = decodeValue(value, typeInfo)
  }

  return decoded
}

function encodeToSearchParams(data: any, searchParams: URLSearchParams, schema: UrlStateSchema): void {
  if (!data || typeof data !== 'object') return

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue

    const typeInfo = getFieldType(schema, key)
    const encoded = encodeValue(value, typeInfo)

    if (Array.isArray(encoded)) {
      encoded.forEach(v => searchParams.append(key, v))
    } else if (encoded !== '') {
      searchParams.set(key, encoded)
    }
  }
}

