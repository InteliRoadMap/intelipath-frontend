import Header from '../components/Header'
import dashboardPreview from '../assets/dashboard-preview.png'
import '../styles/welcome.css'

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <Header />

      <section className="welcome-hero">
        {/* Left Content */}
        <div className="welcome-hero-left">
          <div className="welcome-badge">
            <span className="welcome-badge-icon">✨</span>
            AI-Powered Career Guidance
          </div>

          <h1 className="welcome-hero-title">
            Welcome to<br />
            <span className="highlight">InteliPath</span>
          </h1>

          <p className="welcome-hero-desc">
            Navigate your learning journey and career path in AI-powered engineering.
            We use smart algorithms to analyze real-world market demand, helping you
            become a next-generation software engineer.
          </p>

          <div className="welcome-stats">
            <div className="welcome-stat-item">
              <span className="welcome-stat-number">500+</span>
              <span className="welcome-stat-label">AI Roadmaps</span>
            </div>
            <div className="welcome-stat-item">
              <span className="welcome-stat-number">20k+</span>
              <span className="welcome-stat-label">Students</span>
            </div>
            <div className="welcome-stat-item">
              <span className="welcome-stat-number">95%</span>
              <span className="welcome-stat-label">Success</span>
            </div>
          </div>
        </div>

        {/* Right Preview */}
        <div className="welcome-hero-right">
          <img
            src={dashboardPreview}
            alt="InteliPath Dashboard Preview"
          />
        </div>
      </section>
    </div>
  )
}
