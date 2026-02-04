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

function daysFromNow(days: number): Date {
  const d = new Date()
  d.setDate(d.getDate() + days)
  d.setHours(10, 0, 0, 0)
  return d
}

async function main() {
  // --- SuperAdmin ---
  const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com'
  const password = process.env.SEED_ADMIN_PASSWORD || 'changeme123'

  const existingAdmin = await prisma.superAdmin.findUnique({ where: { email } })
  if (!existingAdmin) {
    const passwordHash = await hash(password, 12)
    await prisma.superAdmin.create({ data: { email, passwordHash } })
    console.log(`Created SuperAdmin: ${email}`)
  } else {
    console.log(`SuperAdmin ${email} already exists.`)
  }

  // --- Skip if clients already exist ---
  const clientCount = await prisma.client.count()
  if (clientCount > 0) {
    console.log(`Database already has ${clientCount} client(s), skipping mockup data.`)
    return
  }

  // --- Clients + Tasks ---
  const client1 = await prisma.client.create({
    data: {
      numePrenume: 'Popescu Ion',
      telefon: '0721 123 456',
      zona: 'Sector 1',
      adresa: 'Str. Victoriei 45, Ap. 12, Bucuresti',
      serieEchipament: 'VLN-2021-4478',
      codISCIR: 'ISCIR-BUC-00123',
      modelEchipament: 'Vaillant ecoTEC plus',
      tasks: {
        create: [
          {
            denumire: 'Revizie anuala',
            data: daysFromNow(5),
            efectuat: false,
            inGarantie: true,
            duritateApa: '22 dH',
            defectiune: '',
            remedieri: '',
            pieseInlocuite: '',
            alteComentarii: 'Programat pentru verificare periodica',
          },
          {
            denumire: 'Inlocuire filtru apa',
            data: daysFromNow(-30),
            efectuat: true,
            inGarantie: true,
            duritateApa: '22 dH',
            defectiune: 'Filtru colmatat',
            remedieri: 'Inlocuire filtru Y 3/4"',
            pieseInlocuite: 'Filtru Y 3/4"',
            alteComentarii: '',
          },
        ],
      },
    },
  })
  console.log(`Created client: ${client1.numePrenume}`)

  const client2 = await prisma.client.create({
    data: {
      numePrenume: 'Ionescu Maria',
      telefon: '0744 987 654',
      zona: 'Sector 3',
      adresa: 'Bd. Unirii 120, Bl. B4, Sc. A, Et. 7, Ap. 28, Bucuresti',
      serieEchipament: 'BXI-2023-7812',
      codISCIR: 'ISCIR-BUC-00456',
      modelEchipament: 'Buderus Logamax plus GB172i',
      tasks: {
        create: [
          {
            denumire: 'Verificare presiune',
            data: daysFromNow(-3),
            efectuat: false,
            inGarantie: false,
            duritateApa: '18 dH',
            defectiune: 'Presiune scazuta in circuit',
            remedieri: '',
            pieseInlocuite: '',
            alteComentarii: 'Clienta a sesizat ca radiatoarele nu se mai incalzesc',
          },
          {
            denumire: 'Punere in functiune',
            data: daysFromNow(-180),
            efectuat: true,
            inGarantie: true,
            duritateApa: '18 dH',
            defectiune: '',
            remedieri: 'Montaj si PIF conform norme',
            pieseInlocuite: '',
            alteComentarii: 'Garantie 5 ani compressor',
          },
        ],
      },
    },
  })
  console.log(`Created client: ${client2.numePrenume}`)

  const client3 = await prisma.client.create({
    data: {
      numePrenume: 'Gheorghe Andrei',
      telefon: '0731 555 888',
      zona: 'Pipera',
      adresa: 'Str. Drumul Taberei 8, Vila 3, Voluntari, Ilfov',
      serieEchipament: 'ARN-2022-1190',
      codISCIR: 'ISCIR-ILF-00789',
      modelEchipament: 'Ariston Clas One 24',
      tasks: {
        create: [
          {
            denumire: 'Revizie anuala',
            data: daysFromNow(15),
            efectuat: false,
            inGarantie: false,
            duritateApa: '30 dH',
            defectiune: '',
            remedieri: '',
            pieseInlocuite: '',
            alteComentarii: 'Client fidel, al 3-lea an de revizie',
          },
          {
            denumire: 'Curatare schimbator',
            data: daysFromNow(-60),
            efectuat: true,
            inGarantie: false,
            duritateApa: '30 dH',
            defectiune: 'Apa calda intermitenta',
            remedieri: 'Curatare chimica schimbator secundar',
            pieseInlocuite: 'Garnituri schimbator',
            alteComentarii: 'Recomandat dedurizator',
          },
          {
            denumire: 'Inlocuire vana de gaz',
            data: daysFromNow(-120),
            efectuat: true,
            inGarantie: false,
            duritateApa: '30 dH',
            defectiune: 'Eroare E501 - vana gaz defecta',
            remedieri: 'Inlocuire vana gaz SIT Sigma 848',
            pieseInlocuite: 'Vana gaz SIT Sigma 848',
            alteComentarii: 'Piesa comandata special, termen livrare 5 zile',
          },
        ],
      },
    },
  })
  console.log(`Created client: ${client3.numePrenume}`)

  const client4 = await prisma.client.create({
    data: {
      numePrenume: 'Dumitrescu Elena',
      telefon: '0755 222 333',
      zona: 'Sector 6',
      adresa: 'Str. Crinului 14, Bucuresti',
      serieEchipament: 'JKR-2020-3345',
      codISCIR: 'ISCIR-BUC-01122',
      modelEchipament: 'Junkers Cerapur Smart',
      tasks: {
        create: [
          {
            denumire: 'Revizie anuala',
            data: daysFromNow(45),
            efectuat: false,
            inGarantie: false,
            duritateApa: '25 dH',
            defectiune: '',
            remedieri: '',
            pieseInlocuite: '',
            alteComentarii: '',
          },
        ],
      },
    },
  })
  console.log(`Created client: ${client4.numePrenume}`)

  const client5 = await prisma.client.create({
    data: {
      numePrenume: 'Stanescu Radu',
      telefon: '0768 111 444',
      zona: 'Sector 2',
      adresa: 'Calea Mosilor 78, Et. 3, Ap. 9, Bucuresti',
      serieEchipament: 'VLN-2019-8890',
      codISCIR: 'ISCIR-BUC-00987',
      modelEchipament: 'Vaillant turboTEC pro',
      tasks: {
        create: [
          {
            denumire: 'Reparatie urgenta',
            data: daysFromNow(-7),
            efectuat: false,
            inGarantie: false,
            duritateApa: '20 dH',
            defectiune: 'Pierdere apa la robinet de umplere',
            remedieri: '',
            pieseInlocuite: '',
            alteComentarii: 'Clientul suna repetat, prioritate ridicata',
          },
          {
            denumire: 'Revizie anuala',
            data: daysFromNow(-365),
            efectuat: true,
            inGarantie: false,
            duritateApa: '20 dH',
            defectiune: '',
            remedieri: 'Curatare arzator, verificare presiuni, test evacuare',
            pieseInlocuite: 'Garnitura arzator',
            alteComentarii: '',
          },
        ],
      },
    },
  })
  console.log(`Created client: ${client5.numePrenume}`)

  const client6 = await prisma.client.create({
    data: {
      numePrenume: 'Marinescu Ana',
      telefon: '0722 666 999',
      zona: 'Chitila',
      adresa: 'Str. Lalelelor 5, Chitila, Ilfov',
      serieEchipament: 'BXI-2024-0012',
      codISCIR: 'ISCIR-ILF-01500',
      modelEchipament: 'Buderus Logamax U072',
    },
  })
  console.log(`Created client: ${client6.numePrenume} (no tasks)`)

  console.log('\nMockup data seeded successfully!')
  console.log('6 clients, 9 tasks total')
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
