export type ID = string
export type Money = number

export interface User {
  _id: ID
  name: string
  email: string
  role?: 'admin' | 'customer'
}

export interface Product {
  _id: ID
  title: string
  description?: string
  price: Money
  stock?: number
  category?: string
  thumbnails?: string[]
  thumbnailPaths?: string[]
  image?: string
}

export interface Category { _id: ID; name: string; slug: string }

export interface OrderItem {
  productId?: ID
  title: string
  price: Money
  qty: number
}

export interface Order {
  _id: ID
  userId?: ID
  items: OrderItem[]
  amount: Money
  status: string
  paymentRef?: string
  address?: Record<string, any>
  createdAt?: string
}

export interface Paginated<T> { data: T[]; total: number; page: number; limit: number }
