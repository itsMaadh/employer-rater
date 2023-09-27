"use client"

import { useEffect, useState } from "react"
import { formatDate } from "@/utils/format-date"
import { Prisma, employer } from "@prisma/client"
import ReactPaginate from "react-paginate"

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
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { StarRating } from "@/components/star-rating"

type OrderByValues = "payment-date" | "number-of-points"
type ReportWithPaymentDetails = Prisma.paymentHistoryGetPayload<{
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
    ReportWithPaymentDetails[]
  >([])
  const [employers, setEmployers] = useState<employer[]>([])
  const [orderBy, setOrderBy] = useState<OrderByValues | null>(null)
  const [page, setPage] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  const LIMIT = 10

  useEffect(() => {
    if (!orderBy) return

    async function fetchReports() {
      try {
        if (orderBy === "payment-date") {
          setEmployers([])
          const fetchRequest = await fetch(
            `/api/reports/payment-history?page=${page}`
          )
          const response = await fetchRequest.json()
          setPaymentHistory(response.data)
          setTotalCount(response.totalCount)
        } else {
          setPaymentHistory([])
          const fetchRequest = await fetch(
            `/api/reports/employers?page=${page}`
          )
          const response = await fetchRequest.json()
          setEmployers(response.data)
          setTotalCount(response.totalCount)
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchReports()
  }, [orderBy, page, totalCount])

  function onOrderBySubmit(data: OrderByValues) {
    setOrderBy(data)
    setPage(1)
  }

  function onPageChange(data: { selected: number }) {
    setPage(data.selected + 1)
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
        <Select onValueChange={onOrderBySubmit}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Order by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="payment-date">Payment date</SelectItem>
            <SelectItem value="number-of-points">Number of points</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {paymentHistory.length > 0 && (
        <div className="py-8">
          <Table>
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
                  <TableCell className="flex justify-center">
                    <StarRating rating={payment.employer.starRating} />
                  </TableCell>
                  <TableCell>
                    {payment.amount ? (
                      payment.amount.toLocaleString("en-US", {
                        style: "currency",
                        currency: "MVR",
                        maximumFractionDigits: 0,
                      })
                    ) : (
                      <Badge>Unpaid</Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {employers.length > 0 && (
        <div className="py-8">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Employer name</TableHead>
                <TableHead className="text-center">Employer points</TableHead>
                <TableHead className="text-center">Employer stars</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {employers.map((employer) => (
                <TableRow>
                  <TableCell>{employer.id}</TableCell>
                  <TableCell className="font-medium">{employer.name}</TableCell>
                  <TableCell className="text-center">
                    {employer.rating}
                  </TableCell>
                  <TableCell className="flex justify-center">
                    <StarRating rating={employer.starRating} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {totalCount > 0 &&
        (paymentHistory.length > 0 || employers.length > 0) && (
          <ReactPaginate
            breakLabel="..."
            marginPagesDisplayed={1}
            nextLabel=">"
            onPageChange={onPageChange}
            pageCount={totalCount / LIMIT}
            previousLabel="<"
            renderOnZeroPageCount={null}
            forcePage={page - 1}
            className="flex justify-center"
            pageLinkClassName={`${buttonVariants({
              variant: "ghost",
            })} mx-1`}
            previousLinkClassName={`${buttonVariants({
              variant: "ghost",
            })} mx-1`}
            nextLinkClassName={`${buttonVariants({
              variant: "ghost",
            })} mx-1`}
            activeLinkClassName={`${buttonVariants({
              variant: "default",
            })} mx-1`}
            breakClassName="flex items-center"
          />
        )}

      {!paymentHistory.length && !employers.length && (
        <div className="pt-10">
          <p className="text-center text-2xl text-gray-500">
            No payment history found
          </p>
        </div>
      )}
    </main>
  )
}
