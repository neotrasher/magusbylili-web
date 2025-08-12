import { http } from './fetcher'
import type { Product, Category, Paginated } from '../types'

function adaptList(x:any): Paginated<Product> {
  const items = Array.isArray(x.payload) ? x.payload : (x.docs || x.data || [])
  return {
    data: items,
    total: x.total || x.totalDocs || items.length,
    page: x.page || x.pageIndex || 1,
    limit: x.limit || x.pageSize || items.length
  }
}

export const api = {
  products: {
    list: (q: Record<string,any> = {}) => {
      const search = new URLSearchParams(q as any).toString()
      const qs = search ? `?${search}` : ''
      return http(`/products${qs}`).then(adaptList)
    },
    get: (id: string) => http(`/products/${id}`) as Promise<Product>
  },
  categories: {
    list: () => http('/categories') as Promise<Category[]>
  },
  auth: {
    login: (body:{email:string;password:string}) => http('/auth/login',{method:'POST',body:JSON.stringify(body)}),
    register: (body:{name:string;email:string;password:string}) => http('/auth/register',{method:'POST',body:JSON.stringify(body)}),
    me: () => http('/me')
  },
  orders: {
    list: () => http('/orders'),
    create: (body:any) => http('/orders',{method:'POST',body:JSON.stringify(body)})
  }
}