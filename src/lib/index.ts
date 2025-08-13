export { defineUrlState } from './core/schema'
export type {
  UrlStateSchema,
  UrlStateOptions,
  UrlStateDefinition,
  DefinedUrlState,
  InferUrlStateType,
  ParsedUrlState,
  UrlStateContext,
} from './core/types'

export { useUrlState, useShareLink, useResetUrlState } from './hooks'

export { z } from 'zod'