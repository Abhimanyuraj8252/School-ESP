import postgres from 'postgres'

// Ensure this only runs on server-side
if (typeof window !== 'undefined') {
    throw new Error('db.ts should only be imported in server-side code')
}

const connectionString = process.env.DATABASE_URL!
const sql = postgres(connectionString)

export default sql
