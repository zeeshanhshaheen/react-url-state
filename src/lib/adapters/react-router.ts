import { useCallback, useMemo, useRef } from 'react'
import { useSearchParams, useNavigate, useLocation } from 'react-router-dom'
import type { DefinedUrlState, UrlStateOptions } from '../core/types'

export function useReactRouterUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
): [T, (updates: Partial<T>) => void] {
  const [searchParams, setSearchParams] = useSearchParams()
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
      setSearchParams(newSearchParams, { 
        replace: mergedOptions.mode === 'replace' 
      })
    }

    if (mergedOptions.debounceMs > 0) {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
      debounceRef.current = setTimeout(updateUrl, mergedOptions.debounceMs)
    } else {
      updateUrl()
    }
  }, [definition, searchParams, mergedOptions, setSearchParams])

  return [state, setState]
}

export function useReactRouterShareLink<T>(definition: DefinedUrlState<T>) {
  const [searchParams] = useSearchParams()
  const location = useLocation()

  const getShareLink = useCallback((baseUrl?: string) => {
    const url = new URL(baseUrl || (window.location.origin + location.pathname))
    const currentState = definition.readFrom(searchParams).data
    const newSearchParams = definition.toSearchParams(currentState)
    
    url.search = newSearchParams.toString()
    return url.toString()
  }, [definition, searchParams, location])

  const copyShareLink = useCallback(async (baseUrl?: string) => {
    const link = getShareLink(baseUrl)
    await navigator.clipboard.writeText(link)
    return link
  }, [getShareLink])

  return {
    getShareLink,
    copyShareLink,
  }
}

export function useReactRouterResetUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
) {
  const [, setSearchParams] = useSearchParams()
  
  const mergedOptions = {
    mode: 'replace' as const,
    ...definition.options,
    ...options,
  }

  const resetUrlState = useCallback(() => {
    const defaultState = definition.schema.parse({})
    const newSearchParams = definition.toSearchParams(defaultState)
    
    setSearchParams(newSearchParams, { 
      replace: mergedOptions.mode === 'replace' 
    })
  }, [definition, mergedOptions.mode, setSearchParams])

  return resetUrlState
}