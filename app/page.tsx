import prisma from "@/lib/prisma"

async function getEmployersData() {
  return await prisma.employer.findMany()
}

export default async function IndexPage() {
  const x = await getEmployersData()
  return (
    <main className="container mx-auto py-8">
      <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
        Dashboard
      </h1>
    </main>
  )
}
