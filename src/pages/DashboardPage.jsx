import { Container, Card, Button, Row, Col } from 'react-bootstrap'
import { useAuth } from '../store/AuthContext'
import { useNavigate } from 'react-router-dom'
import Header from '../components/Header'

export default function DashboardPage() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: 'var(--color-bg)' }}>
      <Header />

      <Container className="py-5">
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card
              className="border-0 shadow-sm"
              style={{ borderRadius: 'var(--radius-2xl)' }}
            >
              <Card.Body className="p-4 p-md-5 text-center">
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: 'var(--color-primary-light)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1.5rem',
                    fontSize: '2rem'
                  }}
                >
                  👤
                </div>

                <h2
                  style={{
                    fontSize: '1.75rem',
                    fontWeight: '700',
                    color: 'var(--color-text-dark)',
                    marginBottom: '0.5rem'
                  }}
                >
                  Welcome, {user?.name || user?.fullName || 'Student'}!
                </h2>

                <p
                  style={{
                    color: 'var(--color-text-gray)',
                    marginBottom: '2rem'
                  }}
                >
                  You are logged in successfully. Your learning journey starts here.
                </p>

                <Card
                  className="border-0 mb-4"
                  style={{
                    backgroundColor: 'var(--color-primary-light)',
                    borderRadius: 'var(--radius-xl)'
                  }}
                >
                  <Card.Body className="p-3">
                    <Row className="text-start">
                      <Col xs={4} className="border-end">
                        <small style={{ color: 'var(--color-text-gray)' }}>Email</small>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem', wordBreak: 'break-all' }}>
                          {user?.email || 'N/A'}
                        </div>
                      </Col>
                      <Col xs={4} className="border-end">
                        <small style={{ color: 'var(--color-text-gray)' }}>Role</small>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem', textTransform: 'capitalize' }}>
                          {user?.role || 'Student'}
                        </div>
                      </Col>
                      <Col xs={4}>
                        <small style={{ color: 'var(--color-text-gray)' }}>Status</small>
                        <div style={{ fontWeight: '500', fontSize: '0.875rem', color: 'var(--color-success)' }}>
                          ● Active
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>

                <Button
                  className="btn-primary-custom"
                  onClick={handleLogout}
                  id="dashboard-logout-btn"
                >
                  Logout
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  )
}
