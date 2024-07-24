/** @type {import('next').NextConfig}*/

const nextConfig = {
    // experimental: {
    //     serverActions: true,
    // },
    async redirects() {
        return [
            {
                source: '/',
                destination: '/login',
                permanent: true,
            },
        ]
    },
}

const dotenv = require('dotenv');
dotenv.config({ path: '../.env.local'});

module.exports = nextConfig
