import { NextResponse } from "next/server"
import starRater from "@/utils/starRater"

import prisma from "@/lib/prisma"

export async function POST(request: Request) {
  const body = await request.json()
  const canUpdatePayment = await checkIfPaymentExistsForCompany(
    body.company,
    body.month,
    body.year
  )
  const status =
    body.month + 3 <= new Date().getMonth() &&
    body.year === new Date().getFullYear()
      ? "late_within_3_months"
      : "late_3_months_after"
  const point = status === "late_within_3_months" ? 2 : 1
  if (canUpdatePayment.canUpdate) {
    await prisma.$transaction([
      prisma.paymentHistory.updateMany({
        where: {
          AND: [
            {
              employer: {
                id: canUpdatePayment.company?.id,
              },
            },
            {
              month: body.month - 1,
            },
            {
              year: body.year,
            },
            {
              amount: null,
            },
          ],
        },
        data: {
          amount: body.amount,
          paymentDate: new Date(),
          status,
        },
      }),
      prisma.employer.updateMany({
        where: {
          name: body.company,
        },
        data: {
          rating: canUpdatePayment.company?.rating
            ? canUpdatePayment.company.rating + point
            : 0,
        },
      }),
    ])
    await prisma.employer.update({
      where: {
        id: canUpdatePayment.company?.id,
      },
      data: {
        starRating: await starRater(prisma, canUpdatePayment.company?.id ?? 0),
      },
    })
    return NextResponse.json({
      success: true,
      message: "Successfully updated payment!",
    })
  } else {
    return NextResponse.json({
      success: false,
      message: "Payment information already exists!",
    })
  }
}

async function checkIfPaymentExistsForCompany(
  company: string,
  month: number,
  year: number
) {
  const companyFromDB = await prisma.employer.findFirst({
    where: { name: company },
  })
  const payment = await prisma.paymentHistory.findFirst({
    where: {
      AND: [
        {
          employer: {
            name: company,
          },
        },
        {
          month: month - 1,
        },
        {
          year: year,
        },
        {
          amount: null,
        },
      ],
    },
  })
  return { canUpdate: Boolean(payment), company: companyFromDB }
}
