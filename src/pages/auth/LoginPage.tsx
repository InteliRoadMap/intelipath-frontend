import { FaGoogle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { useState } from "react"
import authService from "../../service/authService"
import AuthDashboardPreview from "../../components/auth/AuthDashboardPreview"
function LoginPage() {
  const [error, setError] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  // Handle form submission
  const handleLogin = async () => {
    try {
      const response = await authService.login(email, password)
      console.log("Login successful:", response)
    } catch (error) {
      setError("Email hoặc mật khẩu không đúng")
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-[45%_55%]">
        {/* LEFT SIDE */}
        <div className="flex flex-col justify-start px-6 py-8 sm:px-10 lg:px-20 lg:py-14 bg-[#edf4ff]">
          <h1 className="text-4xl font-bold text-[#0f6ea8] mb-16 lg:mb-24">
            InteliPath
          </h1>
          {/* Welcome */}
          <div className="w-full max-w-md">
            <h2 className="text-4xl font-bold text-gray-900 mb-3">
              Welcome Back
            </h2>
            <p className="text-gray-500 mb-10">
              Sign in to continue your skill journey.
            </p>
            {/* Email */}
            <div className="mb-5">
              <label className="block text-sm text-gray-600 mb-2">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {/* Password */}
            <div className="mb-3">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm text-gray-600">Password</label>

                <button className="text-sm text-[#0f6ea8] hover:underline">
                  Forgot password?
                </button>
              </div>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              />
              {/* ERROR MESSAGE */}
              {error && (
                <div className="mt-3 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
                  <p>{error} Vui lòng thử lại.</p>

                  <button className="underline mt-1">Bạn quên mật khẩu?</button>
                </div>
              )}
            </div>
            {/* Sign In */}
            <button
              onClick={handleLogin}
              className="w-full bg-[#006b9f] hover:bg-[#005885] transition-all text-white py-3 rounded-lg font-medium mt-4"
            >
              Sign In
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
              Don't have an account?{" "}
              <Link to="/register">
                <span className="text-[#0f6ea8] font-semibold cursor-pointer">
                  Sign Up
                </span>
              </Link>
            </p>
          </div>
        </div>
        <AuthDashboardPreview />
        {/* RIGHT SIDE  */}
        <div className="hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 opacity-20 rounded-full blur-3xl"></div>
          <div className="relative z-10 text-center max-w-2xl">
            {/* Top */}
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500"></div>

              <h2 className="text-3xl font-bold text-[#12306b] font-['SpaceGrotesk'], sans-serif;">
                IntelliPath
              </h2>
            </div>

            {/* Heading */}
            <h1 className="font-['JetBrains Mono'] text-5xl font-bold text-[#17326b] leading-tight mb-6">
              AI-Powered Career Guidance
              <br />
              for{" "}
              <span className="font-['JetBrains Mono'] text-[#1d75ff]">
                Software Engineering Students
              </span>
            </h1>
            <p className="font-['JetBrains Mono'] text-gray-500 text-lg mb-12">
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
          </div>
        </div>
      </div>
    </div>
  )
}
export default LoginPage
