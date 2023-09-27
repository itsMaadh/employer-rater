import { employer } from "@prisma/client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Avatar, AvatarFallback, AvatarImage } from "../lib/avatar"
import { StarRating } from "./star-rating"

interface TopEmployersCardProps {
  title: string
  description: string
  employers: employer[]
}

export const TopEmployersCard = ({
  title,
  description,
  employers,
}: TopEmployersCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {employers.map((employer) => {
            const avatarName = employer.name
              .split(" ")
              .map((name) => name[0])
              .join("")
              .slice(0, 2)
            return (
              <div key={employer.id} className="flex items-center">
                <Avatar>
                  <AvatarImage
                    src="https://github.com/itsmaadhs.png"
                    alt={employer.name}
                  />
                  <AvatarFallback>{avatarName}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {employer.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {employer.employeeCount} employees
                  </p>
                </div>
                <div className="ml-auto flex items-center">
                  <StarRating rating={employer.starRating} />
                  <p className="ml-2 text-sm font-bold text-gray-900 dark:text-white">
                    {employer.starRating}
                  </p>
                  <span className="mx-1.5 h-1 w-1 rounded-full bg-gray-500 dark:bg-gray-400" />
                  <p className="text-sm font-medium text-gray-900  dark:text-white">
                    {employer.rating} points
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
