export { default } from 'next-auth/middleware'

export const config = {
    matcher: ['/((?!api|login|register|forgot-password|reset-password|activate-account).*)']
}