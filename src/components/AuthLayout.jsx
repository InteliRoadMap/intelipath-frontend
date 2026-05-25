import { Link } from 'react-router-dom'
import dashboardPreview from '../assets/dashboard-preview.png'
import '../styles/auth.css'

export default function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      {/* Left Column - Form */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          InteliPath
        </Link>
        <div className="auth-form-wrapper">
          <div className="auth-form-inner">
            {children}
          </div>
        </div>
      </div>

      {/* Right Column - Dashboard Preview */}
      <div className="auth-right">
        <img
          src={dashboardPreview}
          alt="InteliPath Dashboard Preview - AI-Powered Career Guidance"
          className="auth-preview-image"
        />
      </div>
    </div>
  )
}
