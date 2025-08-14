import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <header className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            React Zod URL State
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Stop manually syncing component state with URL parameters. This library automatically keeps your filters, 
            sorting, and pagination in sync with the URL using TypeScript schemas. No more broken back buttons, 
            lost filter state on refresh, or hand-written query parameter parsing.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <a 
              href="https://react-url-state.vercel.app/" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              🚀 Live Demo
            </a>
            <a 
              href="https://github.com/zeeshanhshaheen/react-url-state" 
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              📦 View on GitHub
            </a>
          </div>
        </header>

        <nav className="mb-12 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Link 
            href="/demo" 
            className="inline-flex items-center text-blue-700 hover:text-blue-800 font-medium"
          >
            Try the Live Demo →
          </Link>
          <p className="text-blue-600 text-sm mt-1">See URL state management with real filters and pagination</p>
        </nav>

        <main className="space-y-12">
          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Installation</h2>
            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm">
              npm install react-zod-url-state
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Before vs After</h2>
            
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-red-700 mb-3">❌ Without react-zod-url-state</h3>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 h-96 overflow-auto">
                  <pre className="text-xs text-red-800"><code>{`import { useSearchParams, useRouter } from 'next/navigation';
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
    router.replace(\`?\${params.toString()}\`);
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
}`}</code></pre>
                </div>
              </div>

              <div>
                <h3 className="text-base sm:text-lg font-semibold text-green-700 mb-3">✅ With react-zod-url-state</h3>
                <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 h-64 sm:h-96 overflow-auto">
                  <pre className="text-xs text-green-800"><code>{`import { defineUrlState, useUrlState, z } from "react-zod-url-state";

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
}`}</code></pre>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Result:</strong> 85% less code, automatic type safety, zero boilerplate, 
                and it handles arrays, dates, and complex objects automatically.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Quick Start</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-3">1. Define your schema</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border overflow-x-auto">
                  <pre className="text-xs sm:text-sm text-gray-800"><code>{`import { defineUrlState, z } from "react-zod-url-state";

export const filters = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().int().min(1).default(1),
  sort: z.enum(["name", "price"]).default("name"),
  inStock: z.boolean().default(false),
  categories: z.array(z.string()).default([]),
}));`}</code></pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">2. Use in your component</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs sm:text-sm text-gray-800"><code>{`import { useUrlState } from "react-zod-url-state";

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
}`}</code></pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">3. URL automatically updates</h3>
                <div className="bg-gray-100 p-4 rounded-lg border text-sm font-mono text-gray-700">
                  /products?q=shoes&page=2&sort=price&inStock=true&categories=sneakers,boots
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Framework Support</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Next.js</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">useNextUrlState(schema)</div>
                  <p>Works with App Router and Pages Router</p>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">React Router</h3>
                <div className="text-sm text-gray-600 space-y-2">
                  <div className="bg-gray-50 p-2 rounded font-mono text-xs">useReactRouterUrlState(schema)</div>
                  <p>Full integration with React Router v6+</p>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium text-gray-900 mb-2">Server-Side Rendering</h4>
              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg border overflow-x-auto">
                <pre className="text-xs sm:text-sm text-gray-800 whitespace-pre"><code>{`// Next.js App Router
export default function Page({ searchParams }) {
  const state = filters.readFrom(searchParams);
  // Use state for data fetching
}

// React Router loader
export async function loader({ request }) {
  const state = getStateFromLoader(filters, request);
  // Use state for data fetching
}`}</code></pre>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Core Features</h2>
            
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-semibold text-gray-900">Type Safety</h3>
                <p className="text-gray-600">Full TypeScript support with Zod schema validation. Catch errors at compile time.</p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-semibold text-gray-900">Automatic Serialization</h3>
                <p className="text-gray-600">Handles arrays, booleans, numbers, dates, and enums automatically.</p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-semibold text-gray-900">Debounced Updates</h3>
                <p className="text-gray-600">Prevent URL spam with configurable debouncing for text inputs.</p>
              </div>

              <div className="border-l-4 border-orange-500 pl-4">
                <h3 className="font-semibold text-gray-900">Share URLs</h3>
                <p className="text-gray-600">Built-in helpers to generate shareable URLs with complete state.</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Advanced Usage</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Debounced Search</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs sm:text-sm text-gray-800"><code>{`const filters = defineUrlState(schema, {
  debounceMs: 300,  // Wait 300ms before updating URL
  mode: "replace"   // Don't create history entries
});`}</code></pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Share Current State</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs sm:text-sm text-gray-800"><code>{`const { copyShareLink } = useShareLink(filters);

<button onClick={() => copyShareLink()}>
  Share Current Filters
</button>`}</code></pre>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Reset to Defaults</h3>
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <pre className="text-xs sm:text-sm text-gray-800"><code>{`const resetState = useResetUrlState(filters);

<button onClick={resetState}>
  Clear All Filters
</button>`}</code></pre>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">API Reference</h2>
            
            <div className="space-y-4 sm:space-y-6">
              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">defineUrlState(schema, options?)</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Creates a URL state definition with Zod schema validation and configuration options.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                      <div className="mb-2">
                        <span className="font-mono text-blue-600">schema</span>: <span className="text-gray-600">Zod schema defining your state structure</span>
                      </div>
                      <div>
                        <span className="font-mono text-blue-600">options?</span>: <span className="text-gray-600">Optional configuration object</span>
                        <div className="ml-2 sm:ml-4 mt-1 text-xs text-gray-500">
                          • <code>mode?: &apos;push&apos; | &apos;replace&apos;</code> - History behavior (default: &apos;replace&apos;)<br/>
                          • <code>debounceMs?: number</code> - Debounce delay in milliseconds (default: 0)<br/>
                          • <code>scope?: &apos;search&apos; | &apos;hash&apos;</code> - URL location (default: &apos;search&apos;)
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                      <span className="font-mono text-green-600">DefinedUrlState&lt;T&gt;</span> with methods:
                      <div className="ml-2 sm:ml-4 mt-1 text-xs text-gray-600">
                        • <code>readFrom(searchParams)</code> - Parse URL params to typed state<br/>
                        • <code>toSearchParams(state)</code> - Serialize state to URLSearchParams<br/>
                        • <code>schema</code> - The Zod schema<br/>
                        • <code>options</code> - Configuration options
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                      <div className="whitespace-pre">{`const filters = defineUrlState(z.object({
  q: z.string().default(""),
  page: z.number().default(1),
}), {
  debounceMs: 300,
  mode: "replace"
});`}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">useUrlState(definition, options?)</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">React hook for syncing component state with URL parameters automatically.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                      <div className="mb-2">
                        <span className="font-mono text-blue-600">definition</span>: <span className="text-gray-600">Result from defineUrlState()</span>
                      </div>
                      <div>
                        <span className="font-mono text-blue-600">options?</span>: <span className="text-gray-600">Override options from definition</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                      <span className="font-mono text-green-600">[state, setState]</span> tuple:
                      <div className="ml-4 mt-1 text-xs text-gray-600">
                        • <code>state</code> - Current URL state (fully typed)<br/>
                        • <code>setState(updates)</code> - Update state (merges with current)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
                      <div className="whitespace-pre">{`const [state, setState] = useUrlState(filters);

// Read current state
console.log(state.q); // fully typed

// Update state (URL updates automatically)
setState({ q: "new search", page: 1 });`}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">useShareLink(definition)</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Hook for generating and copying shareable URLs with current state.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Parameters</h4>
                    <div className="bg-gray-50 p-3 rounded text-xs sm:text-sm overflow-x-auto">
                      <span className="font-mono text-blue-600">definition</span>: <span className="text-gray-600">Result from defineUrlState()</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns</h4>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded text-sm">
                      <span className="font-semibold text-blue-800">Object with methods:</span>
                      <div className="ml-4 mt-1 text-sm text-blue-700">
                        • <code className="bg-blue-100 px-1 rounded">getShareLink(baseUrl?)</code> - Generate shareable URL<br/>
                        • <code className="bg-blue-100 px-1 rounded">copyShareLink(baseUrl?)</code> - Copy URL to clipboard (returns Promise)
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
<div className="whitespace-pre">{`const { getShareLink, copyShareLink } = useShareLink(filters);

const shareUrl = getShareLink(); // Current page with state
const customUrl = getShareLink('https://myapp.com/search');

await copyShareLink(); // Copies to clipboard`}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">useResetUrlState(definition, options?)</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Hook for resetting URL state to schema defaults.</p>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Returns</h4>
                    <div className="bg-green-50 border border-green-200 p-3 rounded text-sm">
                      <span className="font-mono text-green-800">() =&gt; void</span> - <span className="text-green-700">Function to reset state to defaults</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Example</h4>
                    <div className="bg-gray-900 text-gray-100 p-3 rounded font-mono text-xs overflow-x-auto">
<div className="whitespace-pre">{`const resetFilters = useResetUrlState(filters);

<button onClick={resetFilters}>
  Clear All Filters
</button>`}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">Framework-Specific Hooks</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Optimized hooks for specific routing libraries.</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Next.js</h4>
                    <div className="bg-blue-50 border border-blue-200 p-3 rounded">
                      <div className="font-mono text-sm text-blue-800">useNextUrlState(definition)</div>
                      <div className="font-mono text-sm text-blue-800">useNextShareLink(definition)</div>
                      <div className="font-mono text-sm text-blue-800">useNextResetUrlState(definition)</div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">React Router</h4>
                    <div className="bg-purple-50 border border-purple-200 p-3 rounded">
                      <div className="font-mono text-sm text-purple-800">useReactRouterUrlState(definition)</div>
                      <div className="font-mono text-sm text-purple-800">useReactRouterShareLink(definition)</div>
                      <div className="font-mono text-sm text-purple-800">useReactRouterResetUrlState(definition)</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border border-gray-200 rounded-lg p-4 sm:p-6">
                <h3 className="font-mono text-base sm:text-lg font-semibold text-gray-900 mb-3 break-words">SSR Helpers</h3>
                <p className="text-sm sm:text-base text-gray-600 mb-4">Server-side utilities for reading and validating URL state.</p>
                
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <div className="font-mono text-sm text-green-800 mb-1">getStateFromAppRouter(definition, searchParams)</div>
                    <div className="text-xs text-green-700">Next.js App Router - read state from searchParams prop</div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <div className="font-mono text-sm text-green-800 mb-1">getStateFromLoader(definition, request)</div>
                    <div className="text-xs text-green-700">React Router/Remix - read state from loader request</div>
                  </div>

                  <div className="bg-green-50 border border-green-200 p-3 rounded">
                    <div className="font-mono text-sm text-green-800 mb-1">validateUrlState(definition, params)</div>
                    <div className="text-xs text-green-700">Returns {`{ isValid, data, errors }`} for validation</div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <footer className="border-t border-gray-200 pt-8 text-center">
            <p className="text-gray-600">
              Ready to try it? <Link href="/demo" className="text-blue-600 hover:text-blue-800 font-medium">View the interactive demo</Link>
            </p>
          </footer>
        </main>
      </div>
    </div>
  );
}
