import React from 'react'
import { toast } from 'react-hot-toast'
import { useRegisterMutation } from '../features/api/api.slice'
import { useRandomRegister } from '../hooks/useRandomRegister'
import { EventBus } from '../services/eventbus.service'

interface LoginBottomCTAProps {}

export const LoginBottomCTA: React.FC<LoginBottomCTAProps> = ({}) => {
  const [triggerRandomRegister] = useRandomRegister()
  const [register] = useRegisterMutation()

  const handleLoginSelect = (): void => {
    EventBus.$emit('login-select')
  }

  const handleRegisterSelect = (): void => {
    EventBus.$emit('register-select')
  }

  const handleRandomRegister = async (): Promise<void> => {
    const userCredPrms = triggerRandomRegister()
    toast.promise(userCredPrms, {
      loading: 'Generating user...',
      success: 'Logged in successfully',
      error: 'Unable to generate user',
    })
    register(await userCredPrms)
  }

  return (
    <div className="login-bottom-cta">
      <div className="content-wrapper">
        <section className="text">
          <h2 className="title">Don't miss what's happening</h2>
          <small>People on Twitter are the first to know.</small>
        </section>
        <section className="ctas">
          <button className="clear-btn auth-btn" onClick={handleLoginSelect}>
            Log in
          </button>
          <button className="clear-btn auth-btn" onClick={handleRegisterSelect}>
            Sign up
          </button>
          <button className="auth-btn random" onClick={handleRandomRegister}>
            Register random user
          </button>
        </section>
      </div>
    </div>
  )
}
