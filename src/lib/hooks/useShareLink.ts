import { useCallback } from 'react'
import { useSearchParams } from 'next/navigation'
import type { DefinedUrlState } from '../core/types'

export function useShareLink<T>(definition: DefinedUrlState<T>) {
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