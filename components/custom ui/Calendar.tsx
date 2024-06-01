"use client"

import * as React from "react"
import { addDays, addMonths, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

interface ReserveDatesProps{
  className?: React.HTMLAttributes<HTMLDivElement>;
  date: DateRange | undefined,
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  disabledDates: Date[];
}

const ReserveDates = ({className, date, setDate, disabledDates}: ReserveDatesProps) => {
  

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal bg-black text-white",
              !date && "text-white"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            fromDate={addDays(Date(),0)}
            toDate={addMonths(Date(),12)}
            selected={date}
            onSelect={setDate}
            numberOfMonths={1}
            disabled = {disabledDates}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default ReserveDates
