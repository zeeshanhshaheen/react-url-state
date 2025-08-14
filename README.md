# React Zod URL State

Stop manually syncing component state with URL parameters. This library automatically keeps your filters, sorting, and pagination in sync with the URL using TypeScript schemas. No more broken back buttons, lost filter state on refresh, or hand-written query parameter parsing.

[![Demo](https://img.shields.io/badge/Demo-🚀_Live_Demo-blue?style=for-the-badge)](https://react-url-state.vercel.app/)
[![Docs](https://img.shields.io/badge/Docs-📖_Documentation-green?style=for-the-badge)](https://react-url-state.vercel.app/)

## Installation

```bash
npm install react-zod-url-state
```

## Before vs After

### ❌ Without react-zod-url-state

```typescript
import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export function ProductFilters() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState('name');
  const [inStock, setInStock] = useState(false);
  
  // Sync URL to state on mount
  useEffect(() => {
    setQ(searchParams.get('q') || '');
    setPage(parseInt(searchParams.get('page')) || 1);
    setSort(searchParams.get('sort') || 'name');
    setInStock(searchParams.get('inStock') === 'true');
  }, [searchParams]);
  
  // Sync state to URL
  const updateUrl = useCallback((updates) => {
    const params = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value === undefined || value === '') {
        params.delete(key);
      } else {
        params.set(key, String(value));
      }
    });
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);
  
  const handleSearch = (value) => {
    setQ(value);
    updateUrl({ q: value, page: 1 });
  };
  
  const handleSort = (value) => {
    setSort(value);
    updateUrl({ sort: value, page: 1 });
  };
  
  return (
    <div>
      <input 
        value={q}
        onChange={(e) => handleSearch(e.target.value)}
      />
      <select 
        value={sort} 
        onChange={(e) => handleSort(e.target.value)}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}
```

### ✅ With react-zod-url-state

```typescript
import { defineUrlState, useUrlState, z } from "react-zod-url-state";

const filters = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().int().min(1).default(1),
  sort: z.enum(["name", "price"]).default("name"),
  inStock: z.boolean().default(false),
}));

export function ProductFilters() {
  const [state, setState] = useUrlState(filters);

  return (
    <div>
      <input
        value={state.q}
        onChange={(e) => setState({ 
          q: e.target.value, 
          page: 1 
        })}
      />
      
      <select
        value={state.sort}
        onChange={(e) => setState({ 
          sort: e.target.value, 
          page: 1 
        })}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}
```

**Result:** 85% less code, automatic type safety, zero boilerplate, and it handles arrays, dates, and complex objects automatically.

## Quick Start

### 1. Define your schema

```typescript
import { defineUrlState, z } from "react-zod-url-state";

export const filters = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().int().min(1).default(1),
  sort: z.enum(["name", "price"]).default("name"),
  inStock: z.boolean().default(false),
  categories: z.array(z.string()).default([]),
}));
```

### 2. Use in your component

```typescript
import { useUrlState } from "react-zod-url-state";

export function ProductFilters() {
  const [state, setState] = useUrlState(filters);

  return (
    <div>
      <input
        value={state.q}
        onChange={(e) => setState({ q: e.target.value, page: 1 })}
        placeholder="Search..."
      />
      
      <select
        value={state.sort}
        onChange={(e) => setState({ sort: e.target.value })}
      >
        <option value="name">Name</option>
        <option value="price">Price</option>
      </select>
    </div>
  );
}
```

### 3. URL automatically updates

```
/products?q=shoes&page=2&sort=price&inStock=true&categories=sneakers,boots
```

## Framework Support

### Next.js
- `useNextUrlState(schema)`
- Works with App Router and Pages Router

### React Router
- `useReactRouterUrlState(schema)`
- Full integration with React Router v6+

### Server-Side Rendering

```typescript
// Next.js App Router
export default function Page({ searchParams }) {
  const state = filters.readFrom(searchParams);
  // Use state for data fetching
}

// React Router loader
export async function loader({ request }) {
  const state = getStateFromLoader(filters, request);
  // Use state for data fetching
}
```

## Core Features

- ✅ **Type Safety**: Full TypeScript support with Zod schema validation. Catch errors at compile time.
- ✅ **Automatic Serialization**: Handles arrays, booleans, numbers, dates, and enums automatically.
- ✅ **Debounced Updates**: Prevent URL spam with configurable debouncing for text inputs.
- ✅ **Share URLs**: Built-in helpers to generate shareable URLs with complete state.
- ✅ **Back/Forward Navigation**: Works seamlessly with browser navigation
- ✅ **SSR Friendly**: Server-side rendering support for all major frameworks

## Advanced Usage

### Debounced Search

```typescript
const filters = defineUrlState(schema, {
  debounceMs: 300,  // Wait 300ms before updating URL
  mode: "replace"   // Don't create history entries
});
```

### Share Current State

```typescript
const { copyShareLink } = useShareLink(filters);

<button onClick={() => copyShareLink()}>
  Share Current Filters
</button>
```

### Reset to Defaults

```typescript
const resetState = useResetUrlState(filters);

<button onClick={resetState}>
  Clear All Filters
</button>
```

## API Reference

### `defineUrlState(schema, options?)`

Creates a URL state definition with Zod schema validation and configuration options.

**Parameters:**
- `schema`: Zod schema defining your state structure
- `options?`: Optional configuration object
  - `mode?: 'push' | 'replace'` - History behavior (default: 'replace')
  - `debounceMs?: number` - Debounce delay in milliseconds (default: 0)
  - `scope?: 'search' | 'hash'` - URL location (default: 'search')

**Returns:** `DefinedUrlState<T>` with methods:
- `readFrom(searchParams)` - Parse URL params to typed state
- `toSearchParams(state)` - Serialize state to URLSearchParams
- `schema` - The Zod schema
- `options` - Configuration options

**Example:**
```typescript
const filters = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().default(1),
}), {
  debounceMs: 300,
  mode: "replace"
});
```

### `useUrlState(definition, options?)`

React hook for syncing component state with URL parameters automatically.

**Parameters:**
- `definition`: Result from defineUrlState()
- `options?`: Override options from definition

**Returns:** `[state, setState]` tuple:
- `state` - Current URL state (fully typed)
- `setState(updates)` - Update state (merges with current)

**Example:**
```typescript
const [state, setState] = useUrlState(filters);

// Read current state
console.log(state.q); // fully typed

// Update state (URL updates automatically)
setState({ q: "new search", page: 1 });
```

### `useShareLink(definition)`

Hook for generating and copying shareable URLs with current state.

**Parameters:**
- `definition`: Result from defineUrlState()

**Returns:** Object with methods:
- `getShareLink(baseUrl?)` - Generate shareable URL
- `copyShareLink(baseUrl?)` - Copy URL to clipboard (returns Promise)

**Example:**
```typescript
const { getShareLink, copyShareLink } = useShareLink(filters);

const shareUrl = getShareLink(); // Current page with state
const customUrl = getShareLink('https://myapp.com/search');

await copyShareLink(); // Copies to clipboard
```

### `useResetUrlState(definition, options?)`

Hook for resetting URL state to schema defaults.

**Returns:** `() => void` - Function to reset state to defaults

**Example:**
```typescript
const resetFilters = useResetUrlState(filters);

<button onClick={resetFilters}>
  Clear All Filters
</button>
```

### Framework-Specific Hooks

#### Next.js
- `useNextUrlState(definition)`
- `useNextShareLink(definition)`
- `useNextResetUrlState(definition)`

#### React Router
- `useReactRouterUrlState(definition)`
- `useReactRouterShareLink(definition)`
- `useReactRouterResetUrlState(definition)`

### SSR Helpers

Server-side utilities for reading and validating URL state.

- `getStateFromAppRouter(definition, searchParams)` - Next.js App Router - read state from searchParams prop
- `getStateFromLoader(definition, request)` - React Router/Remix - read state from loader request
- `validateUrlState(definition, params)` - Returns `{ isValid, data, errors }` for validation

## License

MIT