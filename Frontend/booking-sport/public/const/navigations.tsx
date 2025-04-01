import { Home, Package, PackageOpen, ShoppingCart, Ticket, Users } from 'lucide-react'

export const DASHBOARD_SIDEBAR_LINKS = [
    {
        key: 'dashboard',
        label: 'Dashboard',
        path: '/admin/dashboard',
        icon: <Home />
    },
    {
        key: 'User',
        label: 'User',
        path: '/admin/user',
        icon: <Users />
    },
    {
        key: 'Fields',
        label: 'Fields',
        path: '/admin/fields',
        icon: <Package />
    },
    {
        key: 'Products',
        label: 'Review',
        path: '/admin/products',
        icon: <PackageOpen />
    },
    {
        key: 'Orders',
        label: 'Booking',
        path: '/admin/orders',
        icon: <ShoppingCart />
    },
    {
        key: 'Coupon',
        label: 'Promotions',
        path: '/admin/coupon',
        icon: <Ticket />
    }

]
