import type { DefinedUrlState } from '../core/types'

export function readFromSearchParams<T>(
  definition: DefinedUrlState<T>,
  searchParams: URLSearchParams | Record<string, string | string[]> | string
): T {
  let params: URLSearchParams | Record<string, string | string[]>
  
  if (typeof searchParams === 'string') {
    params = new URLSearchParams(searchParams)
  } else {
    params = searchParams
  }
  
  const result = definition.readFrom(params)
  return result.data
}

export function toSearchParamsString<T>(
  definition: DefinedUrlState<T>,
  data: T
): string {
  const searchParams = definition.toSearchParams(data)
  return searchParams.toString()
}

export function createUrlWithState<T>(
  definition: DefinedUrlState<T>,
  data: T,
  baseUrl?: string
): string {
  const url = new URL(baseUrl || '/')
  const searchParams = definition.toSearchParams(data)
  url.search = searchParams.toString()
  return url.toString()
}

export function parseUrlForState<T>(
  definition: DefinedUrlState<T>,
  url: string
): T {
  const urlObj = new URL(url)
  return readFromSearchParams(definition, urlObj.searchParams)
}

export function getStateFromRequest<T>(
  definition: DefinedUrlState<T>,
  request: { url: string } | { searchParams: URLSearchParams }
): T {
  if ('url' in request) {
    return parseUrlForState(definition, request.url)
  }
  
  return readFromSearchParams(definition, request.searchParams)
}

export function createLinkWithState<T>(
  definition: DefinedUrlState<T>,
  currentState: T,
  updates: Partial<T>,
  pathname?: string
): string {
  const newState = { ...currentState, ...updates }
  const searchParams = definition.toSearchParams(newState)
  const params = searchParams.toString()
  const path = pathname || '/'
  
  return params ? `${path}?${params}` : path
}

export function validateUrlState<T>(
  definition: DefinedUrlState<T>,
  searchParams: URLSearchParams | Record<string, string | string[]> | string
): { isValid: boolean; data: T; errors?: Record<string, string> } {
  let params: URLSearchParams | Record<string, string | string[]>
  
  if (typeof searchParams === 'string') {
    params = new URLSearchParams(searchParams)
  } else {
    params = searchParams
  }
  
  const result = definition.readFrom(params)
  
  return {
    isValid: !result.errors,
    data: result.data,
    errors: result.errors,
  }
}