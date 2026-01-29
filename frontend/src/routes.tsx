import type { RouteObject } from 'react-router-dom'
import Home from './pages/Home'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import PaymentConfirmation from './pages/PaymentConfirmation'
import Auth from './pages/Auth'
import Account from './pages/Account'
import Admin from './pages/Admin'
import ResetPassword from './pages/ResetPassword'
import ConfirmEmail from './pages/ConfirmEmail'
import NotFound from './pages/NotFound'

const routes: RouteObject[] = [
  { path: '/', element: <Home /> },
  { path: '/product/:id', element: <Product /> },
  { path: '/cart', element: <Cart /> },
  { path: '/checkout', element: <Checkout /> },
  { path: '/payment-confirmation', element: <PaymentConfirmation /> },
  { path: '/auth', element: <Auth /> },
  { path: '/account', element: <Account /> },
  { path: '/admin', element: <Admin /> },
  { path: '/reset-password', element: <ResetPassword /> },
  { path: '/confirm-email', element: <ConfirmEmail /> },
  { path: '*', element: <NotFound /> }
]
export default routes