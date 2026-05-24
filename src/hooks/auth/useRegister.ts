import { useState } from "react"
import { register } from "../../services/authService"

export const useRegisterLogic = () => {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [error, setError] = useState("")
  // Validate form inputs and set error messages accordingly
  const validateForm = (): boolean => {
    if (!fullName.trim()) {
      setError("Please enter your full name.")
      return false
    }

    if (!email.trim()) {
      setError("Please enter your email address.")
      return false
    }

    if (!password) {
      setError("Please enter your password.")
      return false
    }

    if (!confirmPassword) {
      setError("Please confirm your password.")
      return false
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,10}$/

    if (!passwordPattern.test(password)) {
      setError(
        "Passwords must be 4-10 characters and include at least one uppercase letter, one number, and one special character."
      )
      return false
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match")
      return false
    }

    return true
  }

  // Handle the registration process by validating the form and calling the register service
  const handleRegister = async () => {
    setError("")

    const isValid = validateForm()

    if (!isValid) return
    //Receive the registration response and handle errors based on status codes
    try {
      const response = await register({
        email,
        password,
        fullName
      })

      console.log("Registration successful:", response)
    } catch (err: any) {
      console.log(err.response)

      if (err.response) {
        const { status, data } = err.response

        if (status === 400) {
          setError(data.message || "Invalid input")
        } else if (status === 409) {
          setError("Email already exists")
        } else {
          setError(data.message || "Something went wrong")
        }
      } else {
        setError("Cannot connect to server")
      }
    }
  }

  return {
    fullName,
    setFullName,

    email,
    setEmail,

    password,
    setPassword,

    confirmPassword,
    setConfirmPassword,

    showPassword,
    setShowPassword,

    showConfirmPassword,
    setShowConfirmPassword,

    error,

    handleRegister
  }
}
