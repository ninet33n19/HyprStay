"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { format, isWithinInterval, parseISO } from "date-fns"
import { Calendar as LucideCalendar } from "lucide-react"
import { listingsAPI } from "../lib/api"
import { Calendar } from "../components/ui/calendar"
import type { DateRange } from "react-day-picker"

interface BookingCalendarProps {
  listingId: string
  onDateSelect?: (checkIn: Date, checkOut: Date) => void
  className?: string
}

interface BookedDateRange {
  checkIn: string
  checkOut: string
}

export function BookingCalendar({ listingId, onDateSelect, className = "" }: BookingCalendarProps) {
  const [bookedDates, setBookedDates] = useState<BookedDateRange[]>([])
  const [selectedRange, setSelectedRange] = useState<DateRange | undefined>()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBookedDates = async () => {
      try {
        const dates = await listingsAPI.getBookedDates(listingId)
        setBookedDates(dates)
      } catch (error) {
        console.error('Failed to fetch booked dates:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchBookedDates()
  }, [listingId])

  const isDateBooked = (date: Date) => {
    return bookedDates.some(booking => {
      const checkIn = parseISO(booking.checkIn)
      const checkOut = parseISO(booking.checkOut)
      return isWithinInterval(date, { start: checkIn, end: checkOut })
    })
  }

  const disabledDays = [
    { before: new Date() },
    (date: Date) => isDateBooked(date)
  ]

  const handleDateSelect = (value: Date | DateRange | undefined) => {
    if (value && typeof value === "object" && "from" in value) {
      setSelectedRange(value)
      if (value.from && value.to && onDateSelect) onDateSelect(value.from, value.to)
    }
  }

  if (loading) {
    return (
      <div className={`flex items-center justify-center p-8 ${className}`}>
        <div className="text-gray-500">Loading calendar...</div>
      </div>
    )
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <LucideCalendar className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Select Dates</h3>
      </div>
      <div className="border rounded-lg p-4 bg-white overflow-x-auto max-w-full">
        <Calendar
          mode="range"
          selected={selectedRange}
          onSelect={handleDateSelect}
          disabled={disabledDays}
          numberOfMonths={2}
          className="rounded-lg border shadow-sm w-full max-w-2xl mx-auto"
        />
      </div>
      {selectedRange?.from && (
        <div className="text-sm text-gray-600">
          <p>
            Check-in: {format(selectedRange.from, 'PPP')}
          </p>
          {selectedRange.to && (
            <p>
              Check-out: {format(selectedRange.to, 'PPP')}
            </p>
          )}
        </div>
      )}
    </div>
  )
} 