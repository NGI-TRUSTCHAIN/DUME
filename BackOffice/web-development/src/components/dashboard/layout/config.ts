import type { NavItemConfig } from '@/src/types/nav';
import { paths } from '@/src/paths';

export const navItems = [
    { key: 'overview', title: 'Overview', href: paths.dashboard.admin.home, icon: 'chart-pie' },
    { key: 'customers', title: 'Customers', href: paths.dashboard.admin.manageUsers, icon: 'users' },
    { key: 'integrations', title: 'Integrations', href: paths.dashboard.admin.reports, icon: 'plugs-connected' },
    { key: 'settings', title: 'Settings', href: paths.dashboard.users.settings, icon: 'gear-six' },
    { key: 'account', title: 'Account', href: paths.dashboard.users.profile, icon: 'user' },
    { key: 'error', title: 'Error', href: paths.errors.notFound, icon: 'x-square' },
] satisfies NavItemConfig[];