export type ID = string
export type Money = number

export interface Product {
  _id: ID
  title: string
  description?: string
  price: Money
  stock?: number
  category?: string
  thumbnails?: string[]
}

export interface Category { _id: ID; name: string; slug: string }

export interface Paginated<T> { data: T[]; total: number; page: number; limit: number }