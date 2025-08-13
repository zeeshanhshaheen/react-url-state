import type { DefinedUrlState } from '../core/types'
import { readFromSearchParams, validateUrlState, createLinkWithState } from './index'

export function getStateFromLoader<T>(
  definition: DefinedUrlState<T>,
  request: Request
): T {
  const url = new URL(request.url)
  return readFromSearchParams(definition, url.searchParams)
}

export function validateStateFromLoader<T>(
  definition: DefinedUrlState<T>,
  request: Request
): { isValid: boolean; data: T; errors?: Record<string, string> } {
  const url = new URL(request.url)
  return validateUrlState(definition, url.searchParams)
}

export function createRedirectWithState<T>(
  definition: DefinedUrlState<T>,
  currentState: T,
  updates: Partial<T>,
  pathname: string,
  options?: { status?: number }
) {
  const link = createLinkWithState(definition, currentState, updates, pathname)
  
  return new Response(null, {
    status: options?.status || 302,
    headers: {
      Location: link,
    },
  })
}

export function getStateFromParams<T>(
  definition: DefinedUrlState<T>,
  params: URLSearchParams
): T {
  return readFromSearchParams(definition, params)
}