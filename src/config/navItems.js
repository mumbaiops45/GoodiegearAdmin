import {
  LayoutDashboard,
  Package,
  LayoutGrid,
  ShoppingCart,
  Users,
  Store,
  Star,
  ImageIcon,
  Ticket,
  BarChart3,
  Settings, 
  UserCircle,
} from 'lucide-react'  

// Single source of truth for sidebar navigation.
// href uses Next.js path format (no 'to' — this is not React Router).
export const navItems = [
  { href: '/admin/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/admin/categories', label: 'Categories', icon: LayoutGrid },
  { href: '/admin/products',   label: 'Products',   icon: Package },
  { href: '/admin/orders',     label: 'Orders',     icon: ShoppingCart},
  { href: '/admin/customers',  label: 'Customers',  icon: Users },
  { href: '/admin/vendors',    label: 'Vendors',    icon: Store },
  { href: '/admin/reviews',    label: 'Reviews',    icon: Star },
  { href: '/admin/banners',    label: 'Banners',    icon: ImageIcon },
  // { href: '/admin/coupons',    label: 'Coupons',    icon: Ticket },
  { href: '/admin/reports',    label: 'Reports',    icon: BarChart3 },
  // { href: '/admin/settings',   label: 'Settings',   icon: Settings },
  { href: '/admin/profile', label: 'Profile',    icon: UserCircle },
]
