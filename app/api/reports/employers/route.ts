import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const LIMIT = 10
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") ?? "1"

  const data = await prisma.employer.findMany({
    include: {
      payment: true,
    },
    orderBy: {
      rating: "desc",
    },
    take: LIMIT,
    skip: (Number(page) - 1) * LIMIT,
  })

  return NextResponse.json(data)
}
