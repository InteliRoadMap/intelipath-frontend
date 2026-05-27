// Validate email format
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate password: 4-10 chars, at least 1 uppercase, 1 number, 1 special char
export function isValidPassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,10}$/
  return passwordRegex.test(password)
}

// Get error message from API response
export function getErrorMessage(error: any) {
  if (error.response) {
    const { status, data } = error.response
    if (status === 400) return data?.message || 'Invalid input'
    if (status === 401) return data?.message || 'Invalid email or password'
    if (status === 403) return data?.message || 'Account is suspended'
    if (status === 404) return data?.message || 'Email not found'
    return data?.message || 'Something went wrong'
  }
  return 'Cannot connect to server'
}
