import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { isAxiosError } from "axios"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,10}$/
  return passwordRegex.test(password)
}

export function getErrorMessage(error: unknown): string {
  if (isAxiosError<{ message?: string }>(error)) {
    const status = error.response?.status
    const message = error.response?.data?.message

    if (status === 400) return message || "Invalid input"
    if (status === 401) return "Invalid email or password"
    if (status === 403) return message || "Account is suspended"
    if (status === 404) return message || "Email not found"
    if (status === 409) return "Email already exists"

    return message || "Something went wrong"
  }
  return "Cannot connect to server"
}
