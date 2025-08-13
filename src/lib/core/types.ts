import { z } from 'zod'

export type UrlStateSchema<T = any> = z.ZodType<T>

export interface UrlStateOptions {
  mode?: 'push' | 'replace'
  debounceMs?: number
  scope?: 'search' | 'hash'
}

export interface UrlStateDefinition<T = any> {
  schema: UrlStateSchema<T>
  options?: UrlStateOptions
}

export interface DefinedUrlState<T = any> extends UrlStateDefinition<T> {
  readFrom: (searchParams: URLSearchParams | Record<string, string | string[]>) => ParsedUrlState<T>
  toSearchParams: (data: T) => URLSearchParams
}

export type InferUrlStateType<T> = T extends UrlStateDefinition<infer U> ? U : never

export interface ParsedUrlState<T = any> {
  data: T
  errors?: Record<string, string>
}

export interface UrlStateContext {
  searchParams: URLSearchParams
  setSearchParams: (params: URLSearchParams, options?: UrlStateOptions) => void
}