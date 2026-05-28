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

    if (status === 400) {
      console.log("Validation error:", data)
      return data.message || "Invalid input"
    }

    if (status === 401) {
      console.log("Unauthorized:", data)
      return "Invalid email or password"
    }
    if (status === 409) {
      console.log("Email already exists:", data)
      return "Email already exists"
    }

    if (status === 403) {
      console.log("Account suspended:", data)
      return data?.message || "Account is suspended"
    }

    if (status === 404) {
      console.log("Email not found:", data)
      return data?.message || "Email not found"
    }
    console.log("Unexpected error:", data)
    return data.message || "Something went wrong"
  }
  console.log("Cannot connect to server")
  return "Cannot connect to server"
}
