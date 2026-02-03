import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string): string {
  const d = new Date(date)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}.${month}.${year}`
}

export function parseDate(dateString: string): Date {
  const [day, month, year] = dateString.split('.').map(Number)
  return new Date(year, month - 1, day)
}

export function isTaskUpcoming(taskDate: Date | string): boolean {
  const date = new Date(taskDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date >= today
}

export function isTaskPastDue(taskDate: Date | string, efectuat: boolean): boolean {
  if (efectuat) return false
  const date = new Date(taskDate)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  date.setHours(0, 0, 0, 0)
  return date < today
}
