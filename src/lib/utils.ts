export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPassword(password: string): boolean {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,10}$/
  return passwordRegex.test(password)
}

export function getErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error
  ) {
    const { status, data } = (error as any).response

    if (status === 400) return (data as any)?.message || "Invalid input"
    if (status === 401) return "Invalid email or password"
    if (status === 403) return (data as any)?.message || "Account is suspended"
    if (status === 404) return (data as any)?.message || "Email not found"
    if (status === 409) return "Email already exists"

    return (data as any)?.message || "Something went wrong"
  }
  return "Cannot connect to server"
}
