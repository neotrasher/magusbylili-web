import type { Product } from '../types'
import ProductCard from './ProductCard'
export default function ProductGrid({items}:{items:Product[]}){
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {items.map(p=> <ProductCard key={p._id} p={p}/>) }
    </div>
  )
}