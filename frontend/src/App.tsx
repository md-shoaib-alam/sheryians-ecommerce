import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import UserSync from './components/UserSync'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import SignInPage from './pages/auth/SignInPage'
import SignUpPage from './pages/auth/SignUpPage'
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage'
import UserProfilePage from './pages/UserProfile'
import Checkout from './pages/Checkout'
import { About, Contact, Cart } from './pages/StaticPages'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminUsers from './pages/admin/AdminUsers'

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
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/profile" element={<UserProfilePage />} />
          <Route path="/sign-in/*" element={<SignInPage />} />
          <Route path="/sign-up/*" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/admin/orders" element={<AdminOrders />} />
          <Route path="/admin/users" element={<AdminUsers />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}
    </div>
  )
}

export default App
