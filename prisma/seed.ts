import { PrismaClient, paymentStatus } from "@prisma/client"
import Chance from "chance"

const prisma = new PrismaClient()
async function main() {
  const chance = new Chance()
  const employersCount = 50
  const monthsPerYear = 11 // since we start from 0
  const startYear = 2020
  const endYear = 2022

  for (let i = 1; i <= employersCount; i++) {
    const employer = await prisma.employer.create({
      data: {
        employeeCount: chance.integer({ min: 1, max: 100 }),
        name: chance.company(),
      },
    })
    console.log(employer)
    const paymentHistory = []

    for (let year = startYear; year <= endYear; year++) {
      for (let month = 0; month <= monthsPerYear; month++) {
        const dueDate = new Date(year, month, 15)

        let paymentDate: Date | null
        let paymentStatus: paymentStatus
        let paidAmount: number | null = chance.integer({
          min: 30000,
          max: 200000,
        })

        const paymentStatusRand = chance.floating()

        if (paymentStatusRand <= 0.1) {
          paymentStatus = "never_paid"
          paymentDate = null
          paidAmount = null
        } else if (paymentStatusRand <= 0.3) {
          paymentStatus = "late_within_3_months"
          paymentDate = new Date(
            chance.date({
              min: new Date(year, month, 16),
              max: new Date(year, month + 3, 15),
            })
          )
        } else if (paymentStatusRand <= 0.5) {
          paymentStatus = "late_3_months_after"
          paymentDate = new Date(
            chance.date({
              min: new Date(year, month + 3, 16),
              max: new Date(year, month + 7, 1),
            })
          )
        } else {
          paymentStatus = "on_time"
          paymentDate = new Date(
            chance.date({
              min: new Date(year, month, 1),
              max: new Date(year, month, 14),
            })
          )
        }
        console.log(year, month, dueDate)

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

    await prisma.paymentHistory.createMany({
      data: paymentHistory,
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
