const postgres = require('postgres')
require('dotenv').config({ path: '.env.local' })

async function testConnection() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        console.error('❌ DATABASE_URL is not defined in .env.local')
        process.exit(1)
    }

    try {
        const sql = postgres(connectionString)
        const result = await sql`SELECT NOW()`
        console.log('✅ Connection Successful!')
        console.log('Server Time:', result[0].now)
        await sql.end()
    } catch (error) {
        console.error('❌ Connection Failed:', error.message)
        process.exit(1)
    }
}

testConnection()
