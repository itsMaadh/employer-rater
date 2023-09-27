import prisma from "@/lib/prisma"
import { TopEmployersCard } from "@/components/top-employers-card"

async function getTopPerformingEmployers() {
  return await prisma.employer.findMany({ take: 5 })
}

async function getWorstPerformingEmployers() {
  return await prisma.employer.findMany({ take: 5 })
}

export default async function IndexPage() {
  const topPerformingEmployers = await getTopPerformingEmployers()
  const worstPerformingEmployers = await getWorstPerformingEmployers()

  return (
    <main className="container mx-auto py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dashboard
      </h1>
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
