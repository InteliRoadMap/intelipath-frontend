import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa"
import { Link } from "react-router-dom"
import { AuthPreview } from "../../components/auth/AuthDashboardPreview"
import { useRegisterLogic } from "../../hooks/auth/useRegister"

function RegisterPage() {
  const {
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
  } = useRegisterLogic()

  return (
    <div className="h-screen bg-white flex overflow-hidden font-sans relative">
      {/* LEFT COLUMN */}
      {/* 1. ĐIỀU CHỈNH CHIỀU RỘNG TỪ lg:w-[40%] XUỐNG lg:w-[32%] ĐỂ NHƯỜNG KHÔNG GIAN SANG BÊN PHẢI */}
      <div className="w-full lg:w-[67%] flex flex-col h-full overflow-y-auto no-scrollbar border-r border-gray-100 relative bg-[#ffffff]">
        <Link
          to="/"
          className="absolute top-6 left-8 text-[#0f6ea8] font-bold text-xl hover:opacity-80 transition-opacity"
        >
          InteliPath
        </Link>

        <div className="grow flex items-center justify-center px-6 py-6 sm:px-8">
          <div className="w-full max-w-md mb-0 mt-9">
            <h2 className="text-3xl font-bold  text-gray-900 mb-1">
              Create an Account
            </h2>

            <p className="text-gray-500 mb-4 mt-2">
              Join thousands of students engineering build their future.
            </p>

            {/* Full Name */}
            <div className="mb-3 ">
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

            {/* Passwords */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
              {/* Password */}
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

              {/* Confirm Password */}
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

            {/* Error */}
            {error && (
              <div className="mt-3 bg-red-100 border border-red-300 text-red-600 px-4 py-3 rounded-lg text-sm">
                <p>{error}</p>
              </div>
            )}

            {/* Sign Up */}
            <button
              onClick={handleRegister}
              className="w-full bg-[#006b9f] hover:bg-[#005885] transition-all text-white py-3 rounded-lg font-medium mt-4"
            >
              Sign Up
            </button>

            {/* Divider */}
            <div className="flex items-center gap-4 my-5">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-sm">Or sign in with</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Google */}
            <div className="flex justify-center">
              <button className="w-full sm:w-1/2 border border-gray-300 rounded-lg py-3 flex items-center justify-center gap-2 hover:bg-gray-50 transition">
                <FaGoogle />
                Google
              </button>
            </div>

            {/* Footer */}
            <p className="text-center text-gray-500 mt-6">
              Already have an account?{" "}
              <Link to="/login">
                <span className="text-[#0f6ea8] font-semibold cursor-pointer">
                  Sign In
                </span>
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT COLUMN */}
      {/* 2. TĂNG w-[60%] LÊN THÀNH w-[68%] ĐỂ PHẦN GIAO DIỆN PREVIEW RỘNG RA SÁT CẠNH MÀN HÌNH */}
      <div className="w-full bg-bg h-full ...">
        <AuthPreview mentorText="Create your account and let AI guide your engineering journey from day one." />
      </div>
    </div>
  )
}

export default RegisterPage
