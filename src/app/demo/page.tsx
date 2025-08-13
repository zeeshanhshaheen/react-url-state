'use client'

import { useNextUrlState, useNextShareLink } from "@/lib"
import { productFiltersSchema } from "./schema"
import { products, categories, filterProducts } from "./data"
import { useMemo, useState } from "react"
import Link from "next/link"

export default function DemoPage() {
  const [filters, setFilters] = useNextUrlState(productFiltersSchema)
  const { copyShareLink } = useNextShareLink(productFiltersSchema)
  const [copySuccess, setCopySuccess] = useState(false)

  const handleCopyLink = async () => {
    try {
      await copyShareLink()
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (error) {
      console.error('Failed to copy link:', error)
    }
  }

  const filteredProducts = useMemo(() => {
    const filtered = filterProducts(products, filters)
    const itemsPerPage = 4
    const start = (filters.page - 1) * itemsPerPage
    return filtered.slice(start, start + itemsPerPage)
  }, [filters])

  const totalProducts = useMemo(() => {
    return filterProducts(products, filters).length
  }, [filters])

  const totalPages = Math.ceil(totalProducts / 4)

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Product Demo</h1>
              <p className="text-gray-600">URL state management example</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleCopyLink}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                {copySuccess ? "Copied!" : "Share URL"}
              </button>
              <Link href="/" className="text-gray-600 hover:text-gray-900">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <div className="border border-gray-200 rounded-lg p-6 sticky top-8">
              <h2 className="text-lg font-medium text-gray-900 mb-6">Filters</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Sort by</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ sort: e.target.value as any, page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="relevance">Relevance</option>
                    <option value="price_asc">Price: Low to High</option>
                    <option value="price_desc">Price: High to Low</option>
                    <option value="name_asc">Name: A to Z</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.inStock}
                      onChange={(e) => setFilters({ inStock: e.target.checked, page: 1 })}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                    />
                    <span className="text-sm text-gray-900">In Stock Only</span>
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Categories</label>
                  <div className="space-y-2">
                    {categories.map(category => (
                      <label key={category} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={filters.category.includes(category)}
                          onChange={(e) => {
                            const newCategories = e.target.checked
                              ? [...filters.category, category]
                              : filters.category.filter(c => c !== category)
                            setFilters({ category: newCategories, page: 1 })
                          }}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 mr-2"
                        />
                        <span className="text-sm text-gray-900 capitalize">{category}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Price Range</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={filters.priceMin}
                      onChange={(e) => setFilters({ priceMin: Number(e.target.value), page: 1 })}
                      placeholder="Min"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ priceMax: Number(e.target.value), page: 1 })}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setFilters({ 
                    q: "", 
                    page: 1, 
                    sort: "relevance", 
                    inStock: false, 
                    category: [], 
                    priceMin: 0, 
                    priceMax: 1000 
                  })}
                  className="w-full text-sm text-blue-600 hover:text-blue-800"
                >
                  Clear all filters
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <div className="mb-6">
              <p className="text-sm text-gray-600">
                {totalProducts} products • Page {filters.page} of {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xl font-semibold text-gray-900">${product.price}</span>
                    <span className={`px-2 py-1 text-xs rounded ${
                      product.inStock 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found. Try adjusting your filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-1">
                <button
                  onClick={() => setFilters({ page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                  className={`px-3 py-2 text-sm border rounded ${
                    filters.page === 1
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setFilters({ page })}
                    className={`px-3 py-2 text-sm border rounded ${
                      filters.page === page
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setFilters({ page: Math.min(totalPages, filters.page + 1) })}
                  disabled={filters.page === totalPages}
                  className={`px-3 py-2 text-sm border rounded ${
                    filters.page === totalPages
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}