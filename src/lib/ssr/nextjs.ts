import type { DefinedUrlState } from '../core/types'
import { readFromSearchParams, toSearchParamsString, validateUrlState } from './index'

export function getStateFromServerSideProps<T>(
  definition: DefinedUrlState<T>,
  context: { query: Record<string, string | string[]> }
): T {
  return readFromSearchParams(definition, context.query)
}

export function getStateFromStaticProps<T>(
  definition: DefinedUrlState<T>,
  context: { params?: Record<string, string | string[]> }
): T {
  return readFromSearchParams(definition, context.params || {})
}

export function getStateFromAppRouter<T>(
  definition: DefinedUrlState<T>,
  searchParams: Record<string, string | string[]>
): T {
  return readFromSearchParams(definition, searchParams)
}

export function validateStateFromAppRouter<T>(
  definition: DefinedUrlState<T>,
  searchParams: Record<string, string | string[]>
): { isValid: boolean; data: T; errors?: Record<string, string> } {
  return validateUrlState(definition, searchParams)
}

export function generateStaticParams<T>(
  definition: DefinedUrlState<T>,
  stateVariations: T[]
): Array<Record<string, string>> {
  return stateVariations.map(state => {
    const searchParams = definition.toSearchParams(state)
    const params: Record<string, string> = {}
    
    searchParams.forEach((value, key) => {
      params[key] = value
    })
    
    return params
  })
}

export function createMetadataFromState<T>(
  definition: DefinedUrlState<T>,
  state: T,
  options: {
    title?: (state: T) => string
    description?: (state: T) => string
    canonical?: (state: T) => string
  }
) {
  const searchParamsString = toSearchParamsString(definition, state)
  const queryString = searchParamsString ? `?${searchParamsString}` : ''
  
  return {
    title: options.title?.(state),
    description: options.description?.(state),
    alternates: options.canonical ? {
      canonical: options.canonical(state) + queryString
    } : undefined,
  }
}