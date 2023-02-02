import React from 'react'
import { EventBus } from '../services/eventbus.service'

interface LoginBlockProps {}

export const LoginBlock: React.FC<LoginBlockProps> = ({}) => {
  const handleLoginSelect = (): void => {
    EventBus.$emit('login-select')
  }

  const handleRegisterSelect = (): void => {
    EventBus.$emit('register-select')
  }
  return (
    <section className="login-block">
      <h3 className="title">New to Twitter?</h3>
      <small>Sign up now to get your own personalized timeline!</small>
      <div className="login-options">
        <button className="auth-btn login-btn" onClick={handleLoginSelect}>
          Login
        </button>
        <button
          className="auth-btn register-btn"
          onClick={handleRegisterSelect}>
          Create account
        </button>
      </div>
    </section>
  )
}
