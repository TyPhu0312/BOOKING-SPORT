import { Home, Package, ShoppingCart, Ticket, Users, ClipboardList } from 'lucide-react'

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
        key: 'Booking',
        label: 'Booking',
        path: '/admin/booking',
        icon: <ShoppingCart />
    },
    {
        key: 'Payments',
        label: 'Payments',
        path: '/admin/payments',
        icon: <ClipboardList />
    },
    {
        key: 'Coupon',
        label: 'Promotions',
        path: '/admin/coupon',
        icon: <Ticket />
    }

]
