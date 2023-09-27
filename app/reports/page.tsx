"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/utils/format-date"
import { Prisma } from "@prisma/client"

import { Badge } from "@/components/ui/badge"
import { buttonVariants } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StarRating } from "@/components/star-rating"

type OrderByValues = "payment-date" | "number-of-points"
type ReportWithEmployerDetails = Prisma.paymentHistoryGetPayload<{
  include: { employer: true }
}>
enum PaymentStatus {
  never_paid = "Never paid",
  late_within_3_months = "Late within 3 months",
  late_3_months_after = "Late after 3 months",
  on_time = "On time",
}

export default function ReportsPage() {
  const [paymentHistory, setPaymentHistory] = useState<
    ReportWithEmployerDetails[]
  >([])
  const [orderBy, setOrderBy] = useState<OrderByValues | null>(null)

  useEffect(() => {
    if (!orderBy) return

    async function fetchReports() {
      try {
        console.log(orderBy)
        const fetchRequest = await fetch(`/api/reports?order-by=${orderBy}`)
        const response = await fetchRequest.json()
        setPaymentHistory(response)
      } catch (err) {
        console.error(err)
      }
    }

    fetchReports()
  }, [orderBy])

  async function onSubmit(data: OrderByValues) {
    setOrderBy(data)
  }

  return (
    <main className="container mx-auto py-8">
      <div className="flex items-center justify-between">
        <h1 className="scroll-m-20 items-center text-4xl font-extrabold tracking-tight lg:text-5xl">
          Reports
        </h1>
        <Dialog>
          <DialogTrigger>
            <span className={buttonVariants({ variant: "default" })}>
              Add payment
            </span>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure absolutely sure?</DialogTitle>
              <DialogDescription>
                This action cannot be undone. This will permanently delete your
                account and remove your data from our servers.
              </DialogDescription>
            </DialogHeader>
          </DialogContent>
        </Dialog>
      </div>

      <div className="pt-10">
        <Select onValueChange={onSubmit}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="payment-date">Payment date</SelectItem>
            <SelectItem value="number-of-points">Number of points</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentHistory.length > 0 ? (
        <div className="py-8">
          <Table>
            <TableCaption>Recent payment transactions</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employer name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Payment date</TableHead>
                <TableHead className="text-center">Employer points</TableHead>
                <TableHead className="text-center">Employer stars</TableHead>
                <TableHead>Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentHistory.map((payment) => (
                <TableRow>
                  <TableCell>{payment.id}</TableCell>
                  <TableCell className="font-medium">
                    {payment.employer.name}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {PaymentStatus[payment.status]}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {payment.paymentDate ? (
                      formatDate(payment.paymentDate)
                    ) : (
                      <Badge>Unpaid</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-center">
                    {payment.employer.rating}
                  </TableCell>
                  <TableCell className="text-center">
                    <StarRating rating={payment.employer.rating} />
                  </TableCell>
                  <TableCell>
                    {payment.amount?.toLocaleString("en-US", {
                      style: "currency",
                      currency: "MVR",
                      maximumFractionDigits: 0,
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="pt-10">
          <p className="text-center text-2xl text-gray-500">
            No payment history found
          </p>
        </div>
      )}
    </main>
  )
}
