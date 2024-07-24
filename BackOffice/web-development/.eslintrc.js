require('dotenv').config()
/** @type {import('eslint').Linter.Config} */
module.exports = {
  plugins: ['@ts-safeql/eslint-plugin'],
  extends: "next/core-web-vitals",
  parserOptions: {
    project: './tsconfig.json',
  },
  rules: {
    '@ts-safeql/check-sql': [
      'error',
      {
        connections: [
          {
            connectionUrl: process.env.DATABASE_URL,
            // The migrations path:
            migrationsDir: './src/prisma/migrations',
            targets: [
              // what you would like SafeQL to lint. This makes `prisma.$queryRaw` and `prisma.$executeRaw`
              // commands linted
              { tag: 'prisma.+($queryRaw|$executeRaw)', transform: '{type}[]' },
            ],
          },
        ],
      },
    ],
  },
}
