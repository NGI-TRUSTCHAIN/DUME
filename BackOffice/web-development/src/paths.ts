export const paths = {
    home: '/',
    errors: {notFound: '/errors/not-found'},
    auth: {
        signIn: '/login',
        signUp: '/register',
        resetPassword: '/reset-password',
        activateAccount: '/activate-account',
        forgotPassword: '/forgot-password',
    },
    dashboard: {
        users: {
            home: '/dashboard/users',
            profile: '/dashboard/users/profile',
            settings: '/dashboard/users/settings',
            // Add more users-specific routes here
        },
        admin: {
            home: '/dashboard/admin',
            manageUsers: '/dashboard/admin/manage-users',
            settings: '/dashboard/admin/settings',
            reports: '/dashboard/admin/reports',
            // Add more admin-specific routes here
        }
    }
} as const