import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import {
  LayoutDashboard, ClipboardList, Star, Inbox, UserCog, MessageSquare,
} from 'lucide-react'

import { AuthProvider } from '@/context/AuthContext'
import { ToastProvider } from '@/context/ToastContext'

import MainLayout from '@/components/layout/MainLayout'
import DashboardLayout from '@/components/layout/DashboardLayout'

import Home from '@/pages/Home'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import ServiceCategories from '@/pages/ServiceCategories'
import SearchNearby from '@/pages/SearchNearby'
import TechnicianDetail from '@/pages/TechnicianDetail'
import Booking from '@/pages/Booking'
import BookingConfirmation from '@/pages/BookingConfirmation'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import NotFound from '@/pages/NotFound'

import CustomerDashboard from '@/pages/CustomerDashboard'
import MyBookings from '@/pages/MyBookings'
import BookingTracking from '@/pages/BookingTracking'
import ReviewsRatings from '@/pages/ReviewsRatings'

import ProviderDashboard from '@/pages/ProviderDashboard'
import ManageRequests from '@/pages/ManageRequests'
import EditTechnicianProfile from '@/pages/EditTechnicianProfile'
import ProviderReviews from '@/pages/ProviderReviews'

const CUSTOMER_NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/bookings', label: 'My Bookings', icon: ClipboardList },
  { to: '/reviews', label: 'Reviews & Ratings', icon: Star },
]

const PROVIDER_NAV = [
  { to: '/provider/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/provider/requests', label: 'Manage Requests', icon: Inbox },
  { to: '/provider/profile', label: 'Edit Profile', icon: UserCog },
  { to: '/provider/reviews', label: 'Reviews & Ratings', icon: MessageSquare },
]

export default function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public site with navbar/footer */}
            <Route element={<MainLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<ServiceCategories />} />
              <Route path="/search" element={<SearchNearby />} />
              <Route path="/pros/:id" element={<TechnicianDetail />} />
              <Route path="/booking/:technicianId" element={<Booking />} />
              <Route path="/booking-confirmation/:bookingId" element={<BookingConfirmation />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Route>

            {/* Standalone auth pages */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Customer portal */}
            <Route element={<DashboardLayout navItems={CUSTOMER_NAV} title="Customer Dashboard" />}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/bookings" element={<MyBookings />} />
              <Route path="/bookings/:id" element={<BookingTracking />} />
              <Route path="/reviews" element={<ReviewsRatings />} />
            </Route>

            {/* Provider portal */}
            <Route element={<DashboardLayout navItems={PROVIDER_NAV} title="Provider Dashboard" />}>
              <Route path="/provider/dashboard" element={<ProviderDashboard />} />
              <Route path="/provider/requests" element={<ManageRequests />} />
              <Route path="/provider/profile" element={<EditTechnicianProfile />} />
              <Route path="/provider/reviews" element={<ProviderReviews />} />
            </Route>

            <Route path="/404" element={<NotFound />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  )
}
