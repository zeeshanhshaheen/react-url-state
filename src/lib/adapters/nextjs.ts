import { useCallback, useMemo, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import type { DefinedUrlState, UrlStateOptions } from '../core/types'

export function useNextUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
): [T, (updates: Partial<T>) => void] {
  const searchParams = useSearchParams()
  const router = useRouter()
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
      const params = newSearchParams.toString()
      const url = params ? `?${params}` : ''
      
      if (mergedOptions.mode === 'push') {
        router.push(window.location.pathname + url)
      } else {
        router.replace(window.location.pathname + url)
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
  }, [definition, searchParams, mergedOptions, router])

  return [state, setState]
}

export function useNextShareLink<T>(definition: DefinedUrlState<T>) {
  const searchParams = useSearchParams()

  const getShareLink = useCallback((baseUrl?: string) => {
    const url = new URL(baseUrl || window.location.href)
    const currentState = definition.readFrom(searchParams).data
    const newSearchParams = definition.toSearchParams(currentState)
    
    url.search = newSearchParams.toString()
    return url.toString()
  }, [definition, searchParams])

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

export function useNextResetUrlState<T>(
  definition: DefinedUrlState<T>,
  options?: UrlStateOptions
) {
  const router = useRouter()
  
  const mergedOptions = {
    mode: 'replace' as const,
    ...definition.options,
    ...options,
  }

  const resetUrlState = useCallback(() => {
    const defaultState = definition.schema.parse({})
    const newSearchParams = definition.toSearchParams(defaultState)
    
    const params = newSearchParams.toString()
    const url = params ? `?${params}` : ''
    
    if (mergedOptions.mode === 'push') {
      router.push(window.location.pathname + url)
    } else {
      router.replace(window.location.pathname + url)
    }
  }, [definition, mergedOptions.mode, router])

  return resetUrlState
}