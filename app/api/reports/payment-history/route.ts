import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const LIMIT = 10
  const { searchParams } = new URL(request.url)
  const page = searchParams.get("page") ?? "1"

  const data = await prisma.$transaction([
    prisma.paymentHistory.findMany({
      orderBy: { paymentDate: "desc" },
      skip: (Number(page) - 1) * LIMIT,
      take: LIMIT,
      include: {
        employer: true,
      },
    }),
    prisma.paymentHistory.count(),
  ])

  return NextResponse.json({ data: data[0], totalCount: data[1] })
}
