import { ChangeEvent, useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"

import { Button, buttonVariants } from "./ui/button"
import { Input } from "./ui/input"

interface AddPaymentHistoryModelProps {
  onSearch: (term: string) => Promise<{ name: string; id: number }[]>
}

const FormSchema = z.object({
  company: z.string({
    required_error: "Please select a company",
  }),
  amount: z.coerce
    .number({
      required_error: "Please enter an amount",
    })
    .positive(),
  year: z.coerce
    .number({
      required_error: "Please enter a year",
    })
    .min(2021, "Year should be greater than 2021")
    .max(2023, "Year should be less than 2021"),
  month: z.coerce
    .number({
      required_error: "Please enter a month",
    })
    .min(1, "Month should be greater than 1")
    .max(12, "Month should be less than 12"),
})

export const AddPaymentHistoryModel = ({
  onSearch,
}: AddPaymentHistoryModelProps) => {
  const [searchTerm, setSearchTerm] = useState("")
  const [companyNames, setCompanyNames] = useState<
    { name: string; id: number }[]
  >([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
  })

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const term = event.target.value
    setSearchTerm(term)
  }

  const onFormSubmit = async (values: z.infer<typeof FormSchema>) => {
    setIsDialogOpen(false)
    const request = await fetch("/api/payment", {
      method: "POST",
      body: JSON.stringify(values),
      headers: {
        "Content-Type": "application/json",
      },
    })
    const response = await request.json()
    toast({
      title: response.message,
    })
  }

  useEffect(() => {
    async function searchCompanyNames() {
      const response = await onSearch(searchTerm)
      setCompanyNames(response)
    }
    searchCompanyNames()
  }, [searchTerm])

  return (
    <>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger>
          <span
            className={buttonVariants({ variant: "default" })}
            onClick={() => setIsDialogOpen(true)}
          >
            Add payment
          </span>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a payment</DialogTitle>
            <DialogDescription>
              Fill in the details and click on the submit button to add a
              payment.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onFormSubmit)}>
              <FormField
                control={form.control}
                name="company"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.name}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Company name" />
                      </SelectTrigger>
                      <SelectContent>
                        <Input
                          type="search"
                          placeholder="Search company name"
                          className="mb-2"
                          onChange={handleInputChange}
                        />
                        {companyNames.map((company) => (
                          <SelectItem key={company.id} value={company.name}>
                            {company.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem className="pt-2">
                    <FormLabel>Amount</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Amount"
                        className="w-full"
                        onChange={field.onChange}
                        defaultValue={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4">
                <FormField
                  control={form.control}
                  name="month"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Payment month</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Month"
                          className="w-full"
                          onChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem className="pt-2">
                      <FormLabel>Payment year</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Year"
                          className="w-full"
                          onChange={field.onChange}
                          defaultValue={field.value}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="mt-5">
                Submit
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}
