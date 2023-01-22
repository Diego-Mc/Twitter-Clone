import React from 'react'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { useLoginMutation } from '../features/api/api.slice'
import { FormInput } from './FormInput'

interface LoginPopupProps {
  onComposeClose: () => void
}

export const LoginPopup: React.FC<LoginPopupProps> = ({ onComposeClose }) => {
  const [login] = useLoginMutation()

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const formData = new FormData(ev.target as HTMLFormElement)
    const userCred = Object.fromEntries([...formData])
    // TODO: add auth
    const x: any = await login(userCred)
    if (x.data) onComposeClose()
  }

  return (
    <div className="popup" onClick={(e) => onComposeClose()}>
      <section className={`auth-card`} onClick={(e) => e.stopPropagation()}>
        <div className="close-section">
          <div className="icon-wrap" onClick={(e) => onComposeClose()}>
            <CloseIcon />
          </div>
        </div>
        <form className="form-section" onSubmit={handleSubmit}>
          <h2>Login to Twitter</h2>
          <div className="inputs">
            <FormInput id="email" label="Email or username" />
            <FormInput id="password" label="Password" type="password" />
          </div>
          <button className="auth-btn">Login</button>
        </form>
      </section>
    </div>
  )
}
