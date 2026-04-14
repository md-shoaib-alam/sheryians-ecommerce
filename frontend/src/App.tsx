import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import UserSync from './components/UserSync'
import AdminRoute from './components/AdminRoute'

// Lazy loaded pages
const Home = lazy(() => import('./pages/Home'))
const Products = lazy(() => import('./pages/Products'))
const ProductDetails = lazy(() => import('./pages/ProductDetails'))
const SignInPage = lazy(() => import('./pages/auth/SignInPage'))
const SignUpPage = lazy(() => import('./pages/auth/SignUpPage'))
const ForgotPasswordPage = lazy(() => import('./pages/auth/ForgotPasswordPage'))
const UserProfilePage = lazy(() => import('./pages/UserProfile'))
const Recipes = lazy(() => import('./pages/Recipes'))
const Checkout = lazy(() => import('./pages/Checkout'))
const Orders = lazy(() => import('./pages/Orders'))
const OrderDetails = lazy(() => import('./pages/OrderDetails'))
const About = lazy(() => import('./pages/support/About'))
const Contact = lazy(() => import('./pages/support/Contact'))
const Terms = lazy(() => import('./pages/support/Terms'))
const Privacy = lazy(() => import('./pages/support/Privacy'))
const ShippingPolicy = lazy(() => import('./pages/support/ShippingPolicy'))
const RefundPolicy = lazy(() => import('./pages/support/RefundPolicy'))
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'))
const AdminProducts = lazy(() => import('./pages/admin/AdminProducts'))
const AdminOrders = lazy(() => import('./pages/admin/AdminOrders'))
const AdminUsers = lazy(() => import('./pages/admin/AdminUsers'))
const AdminRecipes = lazy(() => import('./pages/admin/AdminRecipes'))

// Non-lazy for small static components if needed, but Cart was bundled
import { Cart } from './pages/StaticPages'

// Loading Component
const PageLoader = () => (
  <div className="flex h-screen w-full items-center justify-center bg-transparent">
    <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-lg"></div>
  </div>
)



const AUTH_ROUTES = ['/sign-in', '/sign-up', '/forgot-password']

function App() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isAuthPage = AUTH_ROUTES.some(route => location.pathname.startsWith(route)) || isAdminPage

  return (
    <div className="min-h-screen bg-transparent">
      <ScrollToTop />
      <UserSync />
      {!isAdminPage && <Navbar />}

      <main className={isAdminPage ? '' : 'min-h-screen'}>
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/sign-in/*" element={<SignInPage />} />
            <Route path="/sign-up/*" element={<SignUpPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/shipping-policy" element={<ShippingPolicy />} />
            <Route path="/refund-policy" element={<RefundPolicy />} />
            
            {/* Admin Routes */}
            <Route element={<AdminRoute />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/products" element={<AdminProducts />} />
              <Route path="/admin/recipes" element={<AdminRecipes />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>
            <Route path="/profile/order/:id" element={<OrderDetails />} />
          </Routes>
        </Suspense>
      </main>


      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
