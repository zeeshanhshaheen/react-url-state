# React URL State

Stop manually syncing component state with URL parameters. This library automatically keeps your filters, sorting, and pagination in sync with the URL using TypeScript schemas. No more broken back buttons, lost filter state on refresh, or hand-written query parameter parsing.

## Installation

```bash
npm install react-zod-url-state
```

## Quick Start

### 1. Define your schema

```typescript
import { defineUrlState, z } from "react-zod-url-state";

const filters = defineUrlState(z.object({
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
        onChange={(e) => setState({ sort: e.target.value, page: 1 })}
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

- **Next.js**: `useNextUrlState()`, `useNextShareLink()`, `useNextResetUrlState()`
- **React Router**: `useReactRouterUrlState()`, `useReactRouterShareLink()`, `useReactRouterResetUrlState()`
- **SSR Ready**: Works with server-side rendering out of the box

## Core Features

- ✅ **Type Safety**: Full TypeScript support with Zod schema validation
- ✅ **Automatic Serialization**: Handles arrays, booleans, numbers, dates, and enums
- ✅ **Debounced Updates**: Prevent URL spam with configurable debouncing
- ✅ **Share URLs**: Built-in helpers to generate shareable URLs with complete state
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

## License

MIT
