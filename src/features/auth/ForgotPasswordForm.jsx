import { useState } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { isValidEmail } from '../../lib/utils'

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email.trim()) {
      setError('Please enter your email address.')
      return
    }
    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    try {
      // Simulate API call for password reset
      await new Promise(resolve => setTimeout(resolve, 1500))
      setSuccess('Password reset link has been sent to your email.')
      setEmail('')
    } catch {
      setError('Failed to send reset link. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="animate-fade-in">
      <h1 className="auth-title">Forgot Password?</h1>
      <p className="auth-subtitle">Enter your email to receive password reset instructions.</p>

      {error && <div className="auth-error">{error}</div>}
      {success && <div className="auth-success">{success}</div>}

      <Form className="auth-form" onSubmit={handleSubmit}>
        <Form.Group className="form-group">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-control-custom"
            id="forgot-email"
          />
        </Form.Group>

        <Button
          type="submit"
          className="btn-primary-custom w-100 mt-2"
          disabled={loading}
          id="forgot-submit-btn"
        >
          {loading ? (
            <><Spinner size="sm" animation="border" className="me-2" />Sending...</>
          ) : (
            'Send Reset Link'
          )}
        </Button>
      </Form>

      <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
        <Link to="/login" className="back-to-login">
          ← Back to Login
        </Link>
      </div>
    </div>
  )
}
