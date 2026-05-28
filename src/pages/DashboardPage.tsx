import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'
import StudentDashboard from './StudentDashboard'
import MentorDashboard from './MentorDashboard'
import CounselorDashboard from './CounselorDashboard'

const ProfileCard = ({ user, title, subtitle, onLogout, icon = '👤', accentColor = 'var(--color-primary-light)' }) => (
  <Container className="py-5">
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="border-0 shadow-sm" style={{ borderRadius: 'var(--radius-2xl)' }}>
          <Card.Body className="p-4 p-md-5 text-center">
            <div style={{
              width: '80px', height: '80px', borderRadius: '50%',
              background: accentColor, display: 'flex', alignItems: 'center',
              justifyContent: 'center', margin: '0 auto 1.5rem', fontSize: '2.5rem'
            }}>
              {icon}
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-dark)', marginBottom: '0.5rem' }}>
              {title}
            </h2>
            <p style={{ color: 'var(--color-text-gray)', marginBottom: '2rem' }}>
              {subtitle}
            </p>
            <Card className="border-0 mb-4" style={{ backgroundColor: accentColor, borderRadius: 'var(--radius-xl)' }}>
              <Card.Body className="p-3">
                <Row className="text-start">
                  <Col xs={4} className="border-end">
                    <small style={{ color: 'var(--color-text-gray)' }}>Email</small>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', wordBreak: 'break-all' }}>{user?.email || 'N/A'}</div>
                  </Col>
                  <Col xs={4} className="border-end">
                    <small style={{ color: 'var(--color-text-gray)' }}>Role</small>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', textTransform: 'capitalize' }}>{user?.role || 'Student'}</div>
                  </Col>
                  <Col xs={4}>
                    <small style={{ color: 'var(--color-text-gray)' }}>Status</small>
                    <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-success)' }}>● Active</div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
            <Button className="btn-primary-custom" onClick={onLogout} id="dashboard-logout-btn">
              Logout
            </Button>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  </Container>
)

// StudentDashboard is now imported from ./StudentDashboard.tsx

// CounselorDashboard is now imported from ./CounselorDashboard.tsx

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const role = user?.role?.toLowerCase() || 'student'

  const handleTestRoleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if (!user) return
    const updatedUser = { ...user, role: e.target.value }
    localStorage.setItem('user', JSON.stringify(updatedUser))
    window.location.reload()
  }

  return (
    <>
      {/* TEST TOOL: Floating Role Switcher */}
      <div style={{ position: 'fixed', bottom: 20, right: 20, zIndex: 1000, background: 'white', padding: '12px', borderRadius: '12px', boxShadow: '0 4px 16px rgba(0,0,0,0.15)', border: '1px solid #e2e8f0' }}>
        <p style={{ margin: '0 0 8px', fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.05em', color: '#64748b' }}>Dev Tool: Switch Role</p>
        <select value={role} onChange={handleTestRoleChange} style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', cursor: 'pointer', background: '#f8fafc' }}>
          <option value="student">🎓 Student</option>
          <option value="mentor">👨‍🏫 Mentor</option>
          <option value="counselor">🧭 Counselor</option>
        </select>
      </div>

      {role === 'mentor' ? (
        <MentorDashboard user={user} onLogout={handleLogout} />
      ) : role === 'counselor' ? (
        <CounselorDashboard user={user} onLogout={handleLogout} />
      ) : (
        <StudentDashboard user={user} onLogout={handleLogout} />
      )}
    </>
  )
}
