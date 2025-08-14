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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">Product Demo</h1>
              <p className="text-gray-600 text-sm sm:text-base">URL state management example</p>
            </div>
            <div className="flex gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={handleCopyLink}
                className="flex-1 sm:flex-none bg-blue-600 text-white px-3 sm:px-4 py-2 rounded hover:bg-blue-700 text-sm sm:text-base"
              >
                {copySuccess ? "Copied!" : "Share URL"}
              </button>
              <Link href="/" className="flex-1 sm:flex-none text-center sm:text-left text-gray-600 hover:text-gray-900 px-3 sm:px-0 py-2 sm:py-0">
                ← Back
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="border border-gray-200 rounded-lg p-4 sm:p-6 lg:sticky lg:top-8">
              <h2 className="text-base sm:text-lg font-medium text-gray-900 mb-4 sm:mb-6">Filters</h2>
              
              <div className="space-y-4 sm:space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Search</label>
                  <input
                    type="text"
                    value={filters.q}
                    onChange={(e) => setFilters({ q: e.target.value, page: 1 })}
                    placeholder="Search products..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">Sort by</label>
                  <select
                    value={filters.sort}
                    onChange={(e) => setFilters({ sort: e.target.value as "relevance" | "price_asc" | "price_desc" | "name_asc", page: 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-900 bg-white focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="number"
                      value={filters.priceMax}
                      onChange={(e) => setFilters({ priceMax: Number(e.target.value), page: 1 })}
                      placeholder="Max"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm sm:text-base text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
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

          <div className="lg:col-span-3 order-1 lg:order-2">
            <div className="mb-4 sm:mb-6">
              <p className="text-sm text-gray-600">
                {totalProducts} products • Page {filters.page} of {totalPages}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              {filteredProducts.map(product => (
                <div key={product.id} className="border border-gray-200 rounded-lg p-3 sm:p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-40 sm:h-48 object-cover rounded mb-3 sm:mb-4"
                  />
                  <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{product.name}</h3>
                  <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <span className="text-lg sm:text-xl font-semibold text-gray-900">${product.price}</span>
                    <span className={`px-2 py-1 text-xs rounded whitespace-nowrap ${
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
              <div className="text-center py-8 sm:py-12">
                <p className="text-gray-600 text-sm sm:text-base">No products found. Try adjusting your filters.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex justify-center gap-1 flex-wrap">
                <button
                  onClick={() => setFilters({ page: Math.max(1, filters.page - 1) })}
                  disabled={filters.page === 1}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded ${
                    filters.page === 1
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Previous</span>
                  <span className="sm:hidden">Prev</span>
                </button>
                <div className="flex gap-1 max-w-xs overflow-x-auto">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => setFilters({ page })}
                      className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded flex-shrink-0 ${
                        filters.page === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
                <button
                  onClick={() => setFilters({ page: Math.min(totalPages, filters.page + 1) })}
                  disabled={filters.page === totalPages}
                  className={`px-2 sm:px-3 py-2 text-xs sm:text-sm border rounded ${
                    filters.page === totalPages
                      ? 'text-gray-400 border-gray-200 cursor-not-allowed'
                      : 'text-gray-700 border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <span className="hidden sm:inline">Next</span>
                  <span className="sm:hidden">Next</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}