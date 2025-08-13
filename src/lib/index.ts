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

export { 
  useNextUrlState, 
  useNextShareLink, 
  useNextResetUrlState,
  useReactRouterUrlState, 
  useReactRouterShareLink, 
  useReactRouterResetUrlState 
} from './adapters'

export {
  readFromSearchParams,
  toSearchParamsString,
  createUrlWithState,
  parseUrlForState,
  getStateFromRequest,
  createLinkWithState,
  validateUrlState,
} from './ssr'

export {
  getStateFromServerSideProps,
  getStateFromStaticProps,
  getStateFromAppRouter,
  validateStateFromAppRouter,
  generateStaticParams,
  createMetadataFromState,
} from './ssr/nextjs'

export {
  getStateFromLoader,
  validateStateFromLoader,
  createRedirectWithState,
  getStateFromParams,
} from './ssr/remix'

export { z } from 'zod'