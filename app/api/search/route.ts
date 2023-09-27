import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const LIMIT = 5
  const { searchParams } = new URL(request.url)
  const query = searchParams.get("query") ?? ""

  const data = await prisma.employer.findMany({
    where: {
      name: { contains: query },
    },
    take: LIMIT,
    select: { name: true, id: true },
  })

  return NextResponse.json(data)
}
