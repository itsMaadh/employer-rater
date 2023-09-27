import { NextResponse } from "next/server"

import prisma from "@/lib/prisma"

export async function GET(request: Request) {
  const LIMIT = 10
  const { searchParams } = new URL(request.url)
  const orderBy = searchParams.get("order-by") ?? "payment-date"
  const page = searchParams.get("page") ?? "1"

  const paymentHistories = await prisma.paymentHistory.findMany({
    orderBy:
      orderBy === "payment-date"
        ? { paymentDate: "desc" }
        : { employer: { rating: "desc" } },
    skip: (Number(page) - 1) * LIMIT,
    take: LIMIT,
    include: {
      employer: true,
    },
  })

  return NextResponse.json(paymentHistories)
}
