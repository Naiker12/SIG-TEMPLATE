
"use client"

import * as React from "react"
import { addDays, endOfMonth, format, startOfMonth, subMonths } from "date-fns"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DateRangePicker({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: new Date(2024, 0, 20),
    to: new Date(),
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
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
              <span>Selecciona un rango</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 flex" align="start">
           <div className="p-2 border-r">
                <Select
                  onValueChange={(value) => {
                    const now = new Date();
                    if (value === "this_month") {
                       setDate({ from: startOfMonth(now), to: endOfMonth(now) });
                    } else if (value === "last_month") {
                       const lastMonth = subMonths(now, 1);
                       setDate({ from: startOfMonth(lastMonth), to: endOfMonth(lastMonth) });
                    } else {
                       setDate({ from: addDays(now, -parseInt(value)), to: now });
                    }
                  }}
                >
                  <SelectTrigger className="w-[150px]">
                    <SelectValue placeholder="Preselección" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">Hoy</SelectItem>
                    <SelectItem value="1">Ayer</SelectItem>
                    <SelectItem value="6">Últimos 7 días</SelectItem>
                    <SelectItem value="29">Últimos 30 días</SelectItem>
                    <SelectItem value="this_month">Este mes</SelectItem>
                    <SelectItem value="last_month">Mes pasado</SelectItem>
                  </SelectContent>
                </Select>
            </div>
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
