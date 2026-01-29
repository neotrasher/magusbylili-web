import { http } from './fetcher'
import type { Product, Category, Paginated, Order } from '../types'


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
    logout: () => http('/auth/logout',{method:'POST'}),
    me: () => http('/me'),
    changePassword: (body:{currentPassword:string;newPassword:string}) => http('/me/change-password',{method:'POST',body:JSON.stringify(body)}),
    requestEmailChange: (body:{newEmail:string}) => http('/me/change-email',{method:'POST',body:JSON.stringify(body)}),
    confirmEmailChange: (body:{token:string}) => http('/me/change-email/confirm',{method:'POST',body:JSON.stringify(body)}),
    requestPasswordReset: (body:{email:string}) => http('/auth/password-reset',{method:'POST',body:JSON.stringify(body)}),
    resetPassword: (body:{token:string;newPassword:string}) => http('/auth/password-reset/confirm',{method:'POST',body:JSON.stringify(body)}),
    promoteAdmin: (body:{email?:string;userId?:string}) => http('/auth/promote-admin',{method:'POST',body:JSON.stringify(body)})
  },
  orders: {
    list: () => http('/orders') as Promise<Order[]>,
    listAll: () => http('/orders/admin') as Promise<Order[]>,
    updateStatus: (id: string, status: string) => http(`/orders/admin/${id}`, { method: 'PATCH', body: JSON.stringify({ status }) }),
    create: (body:any) => http('/orders',{method:'POST',body:JSON.stringify(body)})
  },
  admin: {
    products: {
      create: (body: Partial<Product>) => http('/products',{method:'POST',body:JSON.stringify(body)}),
      update: (id: string, body: Partial<Product>) => http(`/products/${id}`,{method:'PATCH',body:JSON.stringify(body)}),
      remove: (id: string) => http(`/products/${id}`,{method:'DELETE'})
    }
  }
}