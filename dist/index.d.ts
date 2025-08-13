import { z } from 'zod';
export { z } from 'zod';

type UrlStateSchema<T = any> = z.ZodType<T>;
interface UrlStateOptions {
    mode?: 'push' | 'replace';
    debounceMs?: number;
    scope?: 'search' | 'hash';
}
interface UrlStateDefinition<T = any> {
    schema: UrlStateSchema<T>;
    options?: UrlStateOptions;
}
interface DefinedUrlState<T = any> extends UrlStateDefinition<T> {
    readFrom: (searchParams: URLSearchParams | Record<string, string | string[]>) => ParsedUrlState<T>;
    toSearchParams: (data: T) => URLSearchParams;
}
type InferUrlStateType<T> = T extends UrlStateDefinition<infer U> ? U : never;
interface ParsedUrlState<T = any> {
    data: T;
    errors?: Record<string, string>;
}
interface UrlStateContext {
    searchParams: URLSearchParams;
    setSearchParams: (params: URLSearchParams, options?: UrlStateOptions) => void;
}

declare function defineUrlState<T>(schema: UrlStateSchema<T>, options?: UrlStateOptions): DefinedUrlState<T>;

declare function useUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): [T, (updates: Partial<T>) => void];

declare function useShareLink<T>(definition: DefinedUrlState<T>): {
    getShareLink: (baseUrl?: string) => string;
    copyShareLink: (baseUrl?: string) => Promise<string>;
};

declare function useResetUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): () => void;

declare function useNextUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): [T, (updates: Partial<T>) => void];
declare function useNextShareLink<T>(definition: DefinedUrlState<T>): {
    getShareLink: (baseUrl?: string) => string;
    copyShareLink: (baseUrl?: string) => Promise<string>;
};
declare function useNextResetUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): () => void;

declare function useReactRouterUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): [T, (updates: Partial<T>) => void];
declare function useReactRouterShareLink<T>(definition: DefinedUrlState<T>): {
    getShareLink: (baseUrl?: string) => string;
    copyShareLink: (baseUrl?: string) => Promise<string>;
};
declare function useReactRouterResetUrlState<T>(definition: DefinedUrlState<T>, options?: UrlStateOptions): () => void;

declare function readFromSearchParams<T>(definition: DefinedUrlState<T>, searchParams: URLSearchParams | Record<string, string | string[]> | string): T;
declare function toSearchParamsString<T>(definition: DefinedUrlState<T>, data: T): string;
declare function createUrlWithState<T>(definition: DefinedUrlState<T>, data: T, baseUrl?: string): string;
declare function parseUrlForState<T>(definition: DefinedUrlState<T>, url: string): T;
declare function getStateFromRequest<T>(definition: DefinedUrlState<T>, request: {
    url: string;
} | {
    searchParams: URLSearchParams;
}): T;
declare function createLinkWithState<T>(definition: DefinedUrlState<T>, currentState: T, updates: Partial<T>, pathname?: string): string;
declare function validateUrlState<T>(definition: DefinedUrlState<T>, searchParams: URLSearchParams | Record<string, string | string[]> | string): {
    isValid: boolean;
    data: T;
    errors?: Record<string, string>;
};

declare function getStateFromServerSideProps<T>(definition: DefinedUrlState<T>, context: {
    query: Record<string, string | string[]>;
}): T;
declare function getStateFromStaticProps<T>(definition: DefinedUrlState<T>, context: {
    params?: Record<string, string | string[]>;
}): T;
declare function getStateFromAppRouter<T>(definition: DefinedUrlState<T>, searchParams: Record<string, string | string[]>): T;
declare function validateStateFromAppRouter<T>(definition: DefinedUrlState<T>, searchParams: Record<string, string | string[]>): {
    isValid: boolean;
    data: T;
    errors?: Record<string, string>;
};
declare function generateStaticParams<T>(definition: DefinedUrlState<T>, stateVariations: T[]): Array<Record<string, string>>;
declare function createMetadataFromState<T>(definition: DefinedUrlState<T>, state: T, options: {
    title?: (state: T) => string;
    description?: (state: T) => string;
    canonical?: (state: T) => string;
}): {
    title: string | undefined;
    description: string | undefined;
    alternates: {
        canonical: string;
    } | undefined;
};

declare function getStateFromLoader<T>(definition: DefinedUrlState<T>, request: Request): T;
declare function validateStateFromLoader<T>(definition: DefinedUrlState<T>, request: Request): {
    isValid: boolean;
    data: T;
    errors?: Record<string, string>;
};
declare function createRedirectWithState<T>(definition: DefinedUrlState<T>, currentState: T, updates: Partial<T>, pathname: string, options?: {
    status?: number;
}): Response;
declare function getStateFromParams<T>(definition: DefinedUrlState<T>, params: URLSearchParams): T;

export { type DefinedUrlState, type InferUrlStateType, type ParsedUrlState, type UrlStateContext, type UrlStateDefinition, type UrlStateOptions, type UrlStateSchema, createLinkWithState, createMetadataFromState, createRedirectWithState, createUrlWithState, defineUrlState, generateStaticParams, getStateFromAppRouter, getStateFromLoader, getStateFromParams, getStateFromRequest, getStateFromServerSideProps, getStateFromStaticProps, parseUrlForState, readFromSearchParams, toSearchParamsString, useNextResetUrlState, useNextShareLink, useNextUrlState, useReactRouterResetUrlState, useReactRouterShareLink, useReactRouterUrlState, useResetUrlState, useShareLink, useUrlState, validateStateFromAppRouter, validateStateFromLoader, validateUrlState };
