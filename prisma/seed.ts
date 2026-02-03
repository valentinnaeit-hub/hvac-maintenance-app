import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'
import { hash } from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
if (!connectionString) {
  throw new Error('DATABASE_URL is not set')
}

const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'changeme123'

  const existingAdmin = await prisma.superAdmin.findUnique({
    where: { email },
  })

  if (existingAdmin) {
    console.log(`SuperAdmin with email ${email} already exists.`)
    return
  }

  const passwordHash = await hash(password, 12)

  const admin = await prisma.superAdmin.create({
    data: {
      email,
      passwordHash,
    },
  })

  console.log(`Created SuperAdmin: ${admin.email}`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
    await pool.end()
  })
