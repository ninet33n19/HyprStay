"use client"

import * as React from "react"
import { DayPicker } from "react-day-picker"
import type { DateRange } from "react-day-picker"
import "react-day-picker/dist/style.css"

interface CalendarProps {
  mode: "single" | "range"
  selected: Date | DateRange | undefined
  onSelect: (date: Date | DateRange | undefined) => void
  disabled?: any
  numberOfMonths?: number
  defaultMonth?: Date
  className?: string
  required?: boolean
}

export function Calendar({
  mode,
  selected,
  onSelect,
  disabled,
  numberOfMonths = 1,
  defaultMonth,
  className = "",
  required,
}: CalendarProps) {
  if (mode === "range") {
    return (
      <DayPicker
        mode="range"
        selected={selected as DateRange}
        onSelect={onSelect}
        disabled={disabled}
        numberOfMonths={numberOfMonths}
        defaultMonth={defaultMonth}
        className={className}
        {...(required !== undefined ? { required } : {})}
      />
    )
  }
  return (
    <DayPicker
      mode="single"
      selected={selected as Date}
      onSelect={onSelect}
      disabled={disabled}
      numberOfMonths={numberOfMonths}
      defaultMonth={defaultMonth}
      className={className}
    />
  )
} 