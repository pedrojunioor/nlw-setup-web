import { useEffect, useState } from "react"
import { generateRangeDatesFromYearStart } from "../utils/generate-range-between-dates"
import { HabitDay } from "./HabitDay"

import { api } from "../lib/axios"
import dayjs from "dayjs"

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

const summaryDates = generateRangeDatesFromYearStart()

const minimumSummaryDatesSize = 18 * 7
const amountOfDaysToFilter = minimumSummaryDatesSize - summaryDates.length

type Summary = {
  id: string
  date: string
  amount: number
  completed: number
}[]


export function SummaryTable() {

  const [summary, setSummary] = useState<Summary>([])

  useEffect(() => {
    api.get('summary').then(response => {
      setSummary(response.data)
    }).catch(err => {

    })
  }, [])

  return (
    <div className="w-full flex">
      <div className="grid grid-rows-7 grid-flow-row gap-3">
        {weekDays.map((weekDay, i) => {
          return <div
            key={`${weekDay}-${i}`}
            className="text-zinc-400 text-xl h-10 w-10 font-bold flex items-center justify-center">
            {weekDay}
          </div>
        })}
      </div>
      <div className="grid grid-rows-7 grid-flow-col gap-3">

        {summary.length && summaryDates.map((date, i) => {
          const dayInSummary = summary.find(day => {
            return dayjs(date).isSame(day.date, 'day')
          })
          return (
            <HabitDay
              key={date.toISOString()}
              date={date}
              amount={dayInSummary?.amount}
              defaultCompleted={dayInSummary?.completed}
            />
          )
        })}
        {amountOfDaysToFilter > 0 &&
          Array.from({ length: amountOfDaysToFilter }).map((_, i) => {
            return (
              <div key={i}
                className="w-10 h-10 bg-zinc-900 border-2 border-zinc-800 rounded-lg opacity-40 cursor-not-allowed" />
            )
          })}
      </div>
    </div>
  )
}