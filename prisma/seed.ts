import { PrismaClient, paymentStatus } from "@prisma/client"
import Chance from "chance"

import starRater from "../utils/starRater"

const prisma = new PrismaClient()
async function main() {
  const chance = new Chance()
  const employersCount = 50
  const monthsPerYear = 11 // since we start from 0
  const startYear = 2020
  const endYear = 2023 // because without this we can't get past one year data

  for (let i = 1; i <= employersCount; i++) {
    const employer = await prisma.employer.create({
      data: {
        employeeCount: chance.integer({ min: 1, max: 100 }),
        name: chance.company(),
      },
    })
    console.log(`Created employer ${employer.name} with id ${employer.id}`)

    let pointsCount = 0
    const paymentHistory = []

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month <= monthsPerYear; month++) {
        if (new Date(year, month, 1) < new Date()) {
          const dueDate = new Date(year, month, 15)

          let paymentDate: Date | null
          let paymentStatus: paymentStatus
          let paidAmount: number | null = chance.integer({
            min: 30000,
            max: 200000,
          })

          const paymentRand = chance.floating({ min: 0, max: 1 })

          if (paymentRand <= 0.1) {
            paymentStatus = "never_paid"
            paymentDate = null
            paidAmount = null
            pointsCount -= 3
          } else if (paymentRand <= 0.3) {
            paymentStatus = "late_within_3_months"
            paymentDate = new Date(
              chance.date({
                min: new Date(year, month, 16),
                max: new Date(year, month + 3, 15),
              })
            )
            pointsCount += 2
          } else if (paymentRand <= 0.5) {
            paymentStatus = "late_3_months_after"
            paymentDate = new Date(
              chance.date({
                min: new Date(year, month + 3, 16),
                max: new Date(year, month + 7, 1),
              })
            )
            pointsCount += 1
          } else {
            paymentStatus = "on_time"
            paymentDate = new Date(
              chance.date({
                min: new Date(year, month, 1),
                max: new Date(year, month, 14),
              })
            )
            pointsCount += 3
          }

          console.log(
            `Created payment history for ${employer.name} for ${
              month + 1
            }/${year}`
          )

          paymentHistory.push({
            amount: paidAmount,
            dueDate,
            month,
            status: paymentStatus,
            year,
            employerId: employer.id,
            paymentDate,
          })
        }
      }
    }

    await prisma.paymentHistory.createMany({
      data: paymentHistory,
    })
    await prisma.employer.update({
      where: { id: employer.id },
      data: {
        rating: pointsCount,
        starRating: await starRater(prisma, employer.id),
      },
    })
  }
}
main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
