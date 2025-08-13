export interface Product {
  id: number
  name: string
  price: number
  category: string
  inStock: boolean
  image: string
  description: string
}

export const products: Product[] = [
  {
    id: 1,
    name: "Running Shoes",
    price: 120,
    category: "shoes",
    inStock: true,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&h=200&fit=crop",
    description: "Comfortable running shoes for daily workouts"
  },
  {
    id: 2,
    name: "Cotton T-Shirt",
    price: 25,
    category: "shirts",
    inStock: true,
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=200&fit=crop",
    description: "Premium cotton t-shirt with modern fit"
  },
  {
    id: 3,
    name: "Denim Jeans",
    price: 80,
    category: "pants",
    inStock: false,
    image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=200&fit=crop",
    description: "Classic blue denim jeans"
  },
  {
    id: 4,
    name: "Leather Boots",
    price: 200,
    category: "shoes",
    inStock: true,
    image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=300&h=200&fit=crop",
    description: "Handcrafted leather boots"
  },
  {
    id: 5,
    name: "Wool Sweater",
    price: 65,
    category: "shirts",
    inStock: true,
    image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=300&h=200&fit=crop",
    description: "Warm wool sweater for winter"
  },
  {
    id: 6,
    name: "Cargo Shorts",
    price: 45,
    category: "pants",
    inStock: true,
    image: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=300&h=200&fit=crop",
    description: "Comfortable cargo shorts for summer"
  },
  {
    id: 7,
    name: "Sneakers",
    price: 90,
    category: "shoes",
    inStock: false,
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=200&fit=crop",
    description: "Casual sneakers for everyday wear"
  },
  {
    id: 8,
    name: "Polo Shirt",
    price: 35,
    category: "shirts",
    inStock: true,
    image: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=300&h=200&fit=crop",
    description: "Classic polo shirt with collar"
  },
]

export const categories = ["shoes", "shirts", "pants"]

export function filterProducts(products: Product[], filters: {
  q: string
  sort: string
  inStock: boolean
  category: string[]
  priceMin: number
  priceMax: number
}) {
  let filtered = products

  if (filters.q) {
    const query = filters.q.toLowerCase()
    filtered = filtered.filter(product => 
      product.name.toLowerCase().includes(query) ||
      product.description.toLowerCase().includes(query)
    )
  }

  if (filters.inStock) {
    filtered = filtered.filter(product => product.inStock)
  }

  if (filters.category.length > 0) {
    filtered = filtered.filter(product => 
      filters.category.includes(product.category)
    )
  }

  filtered = filtered.filter(product => 
    product.price >= filters.priceMin && product.price <= filters.priceMax
  )

  switch (filters.sort) {
    case "price_asc":
      filtered.sort((a, b) => a.price - b.price)
      break
    case "price_desc":
      filtered.sort((a, b) => b.price - a.price)
      break
    case "name_asc":
      filtered.sort((a, b) => a.name.localeCompare(b.name))
      break
    default:
      break
  }

  return filtered
}