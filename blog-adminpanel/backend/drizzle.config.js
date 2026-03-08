/** @type { import("drizzle-kit").Config } */
export default {
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL,
  },
};