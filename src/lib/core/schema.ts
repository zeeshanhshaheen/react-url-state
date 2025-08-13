import { z } from 'zod'
import type { UrlStateDefinition, UrlStateOptions, UrlStateSchema, ParsedUrlState } from './types'

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
    decoded[key] = decodeValue(value, getFieldType(schema, key))
  }

  return decoded
}

function encodeToSearchParams(data: any, searchParams: URLSearchParams, schema: UrlStateSchema): void {
  if (!data || typeof data !== 'object') return

  for (const [key, value] of Object.entries(data)) {
    if (value === undefined || value === null) continue

    const fieldType = getFieldType(schema, key)
    const encoded = encodeValue(value, fieldType)

    if (Array.isArray(encoded)) {
      encoded.forEach(v => searchParams.append(key, v))
    } else if (encoded !== '') {
      searchParams.set(key, encoded)
    }
  }
}

function getFieldType(schema: UrlStateSchema, key: string): string {
  if (schema instanceof z.ZodObject) {
    const shape = (schema as any).shape
    const field = shape[key]
    
    if (field instanceof z.ZodString) return 'string'
    if (field instanceof z.ZodNumber) return 'number'
    if (field instanceof z.ZodBoolean) return 'boolean'
    if (field instanceof z.ZodArray) return 'array'
    if (field instanceof z.ZodDate) return 'date'
  }
  
  return 'string'
}

function decodeValue(value: string | string[], type: string): any {
  const singleValue = Array.isArray(value) ? value[0] : value

  switch (type) {
    case 'number':
      const num = Number(singleValue)
      return isNaN(num) ? undefined : num
    
    case 'boolean':
      return singleValue === 'true' || singleValue === '1'
    
    case 'array':
      return Array.isArray(value) ? value : singleValue ? singleValue.split(',') : []
    
    case 'date':
      const date = new Date(singleValue)
      return isNaN(date.getTime()) ? undefined : date
    
    default:
      return singleValue || ''
  }
}

function encodeValue(value: any, type: string): string | string[] {
  if (value === undefined || value === null) return ''

  switch (type) {
    case 'boolean':
      return value ? '1' : '0'
    
    case 'array':
      return Array.isArray(value) ? value.map(String) : [String(value)]
    
    case 'date':
      return value instanceof Date ? value.toISOString() : String(value)
    
    default:
      return String(value)
  }
}