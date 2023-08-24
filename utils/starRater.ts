import { PrismaClient } from "@prisma/client"

export default async function starRater(
  prisma: PrismaClient,
  employerId: number
): Promise<number> {
  const twelveMonthsPayHistory = await prisma.paymentHistory.findMany({
    where: {
      employerId: employerId,
      dueDate: {
        gte: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
      },
      status: "never_paid",
    },
  })

  if (twelveMonthsPayHistory.length === 0) {
    return 5
  } else {
    const currentDate = new Date()
    const startMonth = new Date(currentDate)
    startMonth.setMonth(currentDate.getMonth() - 6)
    startMonth.setDate(1)

    const endMonth = new Date(currentDate)
    endMonth.setDate(0)

    const sixMonthsPayHistory = await prisma.paymentHistory.findMany({
      where: {
        employerId: employerId,
        dueDate: {
          gte: startMonth,
          lte: endMonth,
        },
        status: "never_paid",
      },
    })

    if (sixMonthsPayHistory.length === 0) {
      return 4
    } else {
      const currentDate = new Date()
      const startMonth = new Date(currentDate)
      startMonth.setMonth(currentDate.getMonth() - 3)
      startMonth.setDate(1)

      const endMonth = new Date(currentDate)
      endMonth.setDate(0)
      const threeMonthsPayHistory = await prisma.paymentHistory.findMany({
        where: {
          employerId: employerId,
          dueDate: {
            gte: startMonth,
            lte: endMonth,
          },
          status: "never_paid",
        },
      })

      if (threeMonthsPayHistory.length === 0) {
        return 3
      } else {
        return 0
      }
    }
  }
}
