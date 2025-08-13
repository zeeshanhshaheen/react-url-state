import { useCallback, useMemo, useRef } from 'react'
import { useSearchParams } from 'next/navigation'
import type { DefinedUrlState, InferUrlStateType, UrlStateOptions } from '../core/types'

export function useUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
): [T, (updates: Partial<T>) => void] {
  const searchParams = useSearchParams()
  const debounceRef = useRef<NodeJS.Timeout | undefined>(undefined)
  
  const mergedOptions = useMemo(() => ({
    mode: 'replace' as const,
    debounceMs: 0,
    scope: 'search' as const,
    ...definition.options,
    ...options,
  }), [definition.options, options])

  const state = useMemo(() => {
    const result = definition.readFrom(searchParams)
    return result.data
  }, [definition, searchParams])

  const setState = useCallback((updates: Partial<T>) => {
    const currentState = definition.readFrom(searchParams).data
    const newState = { ...currentState, ...updates }
    const newSearchParams = definition.toSearchParams(newState)

    const updateUrl = () => {
      const url = new URL(window.location.href)
      url.search = newSearchParams.toString()
      
      if (mergedOptions.mode === 'push') {
        window.history.pushState(null, '', url.toString())
      } else {
        window.history.replaceState(null, '', url.toString())
      }
    }

    if (mergedOptions.debounceMs > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(updateUrl, mergedOptions.debounceMs)
    } else {
      updateUrl()
    }
  }, [definition, searchParams, mergedOptions])

  return [state, setState]
}