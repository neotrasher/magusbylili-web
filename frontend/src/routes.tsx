import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Auth from './pages/Auth'
import Account from './pages/Account'
import NotFound from './pages/NotFound'

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <Product /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/auth', element: <Auth /> },
  { path: '/account', element: <Account /> },
  { path: '*', element: <NotFound /> }
]
export default routes