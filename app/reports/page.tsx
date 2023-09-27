import { buttonVariants } from "@/components/ui/button"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../lib/dialog"

export default async function ReportsPage() {
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

      <div></div>
    </main>
  )
}
