export interface ProductResponse {
  results: number
  metadata: Metadata
  data: Product[]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Metadata = Record<string, any>

export interface Product {
  sold?: number
  images?: string[]
  subcategory?: Subcategory[]
  ratingsQuantity?: number
  _id?: string
  title?: string
  slug?: string
  description?: string
  quantity?: number
  price?: number
  imageCover?: string
  category?: Category
  brand?: Brand
  ratingsAverage?: number
  priceAfterDiscount?: number
  createdAt?: string
  updatedAt?: string
  id?: string
}

export interface Subcategory {
  _id: string
  name: string
  slug: string
  category: string
}

export interface Category {
  _id: string
  name: string
  slug: string
  image: string
}

export interface Brand {
  _id: string
  name: string
  slug: string
  image: string
}
