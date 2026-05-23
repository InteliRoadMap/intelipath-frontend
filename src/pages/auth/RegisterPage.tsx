import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"
import { BsFillPeopleFill } from "react-icons/bs"
import { FaGraduationCap } from "react-icons/fa6"
import { HiMiniTrophy } from "react-icons/hi2"
import { Link } from "react-router-dom"
import { useState } from "react"
import { register } from "../../service/authService"
import AuthDashboardPreview from "../../components/auth/AuthDashboardPreview"
function RegisterPage() {
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  // Handle form submission
  const handleRegister = async () => {
    if (!fullName.trim()) {
      setError("Please enter your full name and email.")
      return
    }

    if (!email.trim()) {
      setError("Please enter your email address and password.")
      return
    }

    if (!password) {
      setError("Please enter your password and confirm password.")
      return
    }

    if (!confirmPassword) {
      setError("Please confirm your password.")
      return
    }

    const passwordPattern = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{4,10}$/

    if (!passwordPattern.test(password)) {
      setError(
        "Passwords must be at least 4 characters and no more than 10 characters, including at least one uppercase letter, one number, and one special character."
      )
      return
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match")
      return
    }
    // Call the register function from authService
    try {
      const response = await register({
        fullName,
        email,
        password
      })

      console.log("Register successful:", response.data)
      setError("")
    } catch (err: any) {
      console.log(err.response)

      if (err.response?.status === 400) {
        setError(err.response.data.message)
      } else if (err.response?.status === 403) {
        setError("Invalid API Key")
      } else {
        setError("Registration failed. Please try again.")
      }
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-start px-6 py-8 sm:px-10 lg:px-20 lg:py-14 bg-[#ebf3ff]">
          <h1 className="text-4xl font-bold text-[#0f6ea8] mb-16 lg:mb-24">
            InteliPath
          </h1>
          {/* Welcome */}
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Create an Account
            </h2>
            <p className="text-gray-500 mb-10">
              Join thousands of students engineering build their future.
            </p>
            {/* Full Name */}
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-2">
                Full Name
              </label>

              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-2">
                Email Address
              </label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Password
                </label>

                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f6ea8]"
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm text-gray-600 mb-2">
                  Confirm Password
                </label>

                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-11 outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                    onClick={() => setShowConfirmPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#0f6ea8]"
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
            </div>
            {error && (
              <div className="mt-3 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
                <p>{error}</p>
              </div>
            )}
            {/* Sign In */}
            <button
              onClick={handleRegister}
              className="w-full bg-[#006b9f] hover:bg-[#005885] transition-all text-white py-3 rounded-lg font-medium mt-4"
            >
              Sign Up
            </button>
            {/* Divider */}
            <div className="flex items-center gap-4 my-8">
              <div className="flex-1 h-px bg-gray-300"></div>

              <span className="text-gray-400 text-sm">Or sign in with</span>

              <div className="flex-1 h-px bg-gray-300"></div>
            </div>
            {/* Social  */}
            <div className="flex justify-center">
              <button className="w-full sm:w-1/2 border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FaGoogle />
                Google
              </button>
            </div>
            {/* Footer */}
            <p className="text-center text-gray-500 mt-10">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-[#0f6ea8] font-semibold cursor-pointer">
                  Sign In
                </span>
              </Link>
            </p>
          </div>
        </div>
        <AuthDashboardPreview />
        {/* RIGHT SIDE LEGACY */}
        <div className="hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center max-w-2xl">
            {/* Top */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500"></div>

              <h2 className="text-3xl font-bold text-[#12306b]">IntelliPath</h2>
            </div>

            {/* Heading */}
            <h1 className="text-5xl font-bold text-[#17326b] leading-tight mb-6">
              AI-Powered Career Guidance
              <br />
              for{" "}
              <span className="text-[#1d75ff]">
                Software Engineering Students
              </span>
            </h1>
            <p className="text-gray-500 text-lg mb-12">
              Your personalized roadmap to learn, grow and
              <br />
              build your dream career.
            </p>
            {/* Cards */}
            <div className="grid grid-cols-2 gap-5 mb-10">
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <h3 className="text-left text-gray-500 text-sm mb-3">
                  SKILL PROGRESS
                </h3>
                <div className="flex items-center justify-center">
                  <div className="w-28 h-28 rounded-full border-10 border-blue-500 flex items-center justify-center text-2xl font-bold text-[#17326b]">
                    75%
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <h3 className="text-left text-gray-500 text-sm mb-5">
                  YOUR LEARNING ROADMAP
                </h3>

                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-blue-100"></div>
                  <div className="flex-1 h-1 bg-blue-200 mx-2"></div>

                  <div className="w-10 h-10 rounded-full bg-blue-500"></div>
                  <div className="flex-1 h-1 bg-blue-200 mx-2"></div>

                  <div className="w-10 h-10 rounded-full bg-blue-100"></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md">
                <h3 className="text-left text-gray-500 text-sm mb-4">
                  CAREER RECOMMENDATION
                </h3>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-lg font-bold text-[#17326b]">
                    Backend Developer
                  </p>

                  <p className="text-blue-500 font-semibold mt-2">95% Match</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-md flex flex-col items-center justify-center">
                <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                  🤖
                </div>

                <p className="mt-4 text-[#17326b] font-semibold">AI Mentor</p>
              </div>
            </div>
            {/* Bottom Stats */}
            <div className="bg-white rounded-2xl shadow-md py-6 px-10 flex items-center justify-around">
              <div>
                <h3 className="text-3xl font-bold text-[#1d75ff]">
                  <BsFillPeopleFill size={32} className="inline mr-2" /> 500+
                </h3>

                <p className="text-gray-500">AI Roadmaps</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1d75ff]">
                  <FaGraduationCap size={32} className="inline mr-2" /> 20K+
                </h3>

                <p className="text-gray-500">Students</p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#1d75ff]">
                  <HiMiniTrophy size={32} className="inline mr-2" /> 95%
                </h3>

                <p className="text-gray-500">Success Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
export default RegisterPage
