import { useCallback } from 'react'
import type { DefinedUrlState, UrlStateOptions } from '../core/types'

export function useResetUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
) {
  const mergedOptions = {
    mode: 'replace' as const,
    ...definition.options,
    ...options,
  }

  const resetUrlState = useCallback(() => {
    const defaultState = definition.schema.parse({})
    const newSearchParams = definition.toSearchParams(defaultState)
    
    const url = new URL(window.location.href)
    url.search = newSearchParams.toString()
    
    if (mergedOptions.mode === 'push') {
      window.history.pushState(null, '', url.toString())
    } else {
      window.history.replaceState(null, '', url.toString())
    }
  }, [definition, mergedOptions.mode])

  return resetUrlState
}