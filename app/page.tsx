import prisma from "@/lib/prisma"
import { StatsCard } from "@/components/stats-card"
import { TopEmployersCard } from "@/components/top-employers-card"

async function getTopPerformingEmployers() {
  return await prisma.employer.findMany({
    take: 5,
    orderBy: [{ starRating: "desc" }, { rating: "desc" }],
  })
}

async function getWorstPerformingEmployers() {
  return await prisma.employer.findMany({
    take: 5,
    orderBy: [{ starRating: "asc" }, { rating: "asc" }],
  })
}

async function getTotalPensionAmountForTheYear() {
  return await prisma.paymentHistory.groupBy({
    by: ["year"],
    where: {
      year: new Date().getFullYear(),
    },
    _sum: {
      amount: true,
    },
  })
}

async function getTotalNumberOfEmployers() {
  return await prisma.employer.count()
}

async function getEmployersWithFiveStarRating() {
  return await prisma.employer.count({
    where: {
      starRating: 5,
    },
  })
}

export default async function IndexPage() {
  const topPerformingEmployers = await getTopPerformingEmployers()
  const worstPerformingEmployers = await getWorstPerformingEmployers()
  const totalPensionAmountForTheYear = await getTotalPensionAmountForTheYear()

  const stats = [
    {
      title: "Total pension amount for the year",
      value: totalPensionAmountForTheYear[0]._sum.amount?.toLocaleString(
        "en-US",
        {
          style: "currency",
          currency: "MVR",
          maximumFractionDigits: 0,
        }
      ),
    },
    {
      title: "Total number of registered employers",
      value: (await getTotalNumberOfEmployers()).toString(),
    },
    {
      title: "Total number of employers with 5 star rating",
      value: (await getEmployersWithFiveStarRating()).toString(),
    },
  ]

  return (
    <main className="container mx-auto py-8">
      <h1 className="scroll-m-20 pb-8 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dashboard
      </h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {stats.map((stat) => (
          <StatsCard
            key={stat.title}
            title={stat.title}
            value={stat.value || "0"}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-8 py-8 md:grid-cols-2">
        <TopEmployersCard
          title="Best performing employers"
          description="Top 5 employees with most stars and highest points"
          employers={topPerformingEmployers}
        />
        <TopEmployersCard
          title="Worst performing employers"
          description="Top 5 employees with least stars and points"
          employers={worstPerformingEmployers}
        />
      </div>
    </main>
  )
}
