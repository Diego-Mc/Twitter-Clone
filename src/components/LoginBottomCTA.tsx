import React from 'react'
import { EventBus } from '../services/eventbus.service'

interface LoginBottomCTAProps {}

export const LoginBottomCTA: React.FC<LoginBottomCTAProps> = ({}) => {
  const handleLoginSelect = () => {
    EventBus.$emit('login-select')
  }

  const handleRegisterSelect = () => {
    EventBus.$emit('register-select')
  }
  return (
    <div className="login-bottom-cta">
      <div className="content-wrapper">
        <section className="text">
          <h2 className="title">Don't miss what's happening</h2>
          <small>People on Twitter are the first to know.</small>
        </section>
        <section className="ctas">
          <button className="login-btn auth-btn" onClick={handleLoginSelect}>
            Log in
          </button>
          <button
            className="signup-btn auth-btn"
            onClick={handleRegisterSelect}>
            Sign up
          </button>
        </section>
      </div>
    </div>
  )
}
