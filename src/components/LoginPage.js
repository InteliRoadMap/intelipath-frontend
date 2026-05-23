import { login } from "../service/authService"

const HandleLogin = async () => {
  try {
    const response = await login("email", "password")
    console.log("Login successful:", response)
  } catch (error) {
    console.error("Login failed:", error)
  }
}
