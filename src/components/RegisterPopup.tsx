import { SerializedError } from '@reduxjs/toolkit'
import { FetchBaseQueryError } from '@reduxjs/toolkit/dist/query'
import React from 'react'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { useRegisterMutation } from '../features/api/api.slice'
import { FormInput } from './FormInput'

interface RegisterPopupProps {
  onComposeClose: () => void
}

export const RegisterPopup: React.FC<RegisterPopupProps> = ({
  onComposeClose,
}) => {
  const [register] = useRegisterMutation()

  const handleSubmit = async (ev: React.FormEvent) => {
    ev.preventDefault()
    const formData = new FormData(ev.target as HTMLFormElement)
    const userCred = Object.fromEntries([...formData])
    // TODO: add auth
    const x: any = await register(userCred)
    if (x.data) onComposeClose()
  }

  return (
    <div className="popup" onClick={() => onComposeClose()}>
      <section className={`auth-card`} onClick={(e) => e.stopPropagation()}>
        <div className="close-section">
          <div className="icon-wrap" onClick={() => onComposeClose()}>
            <CloseIcon />
          </div>
        </div>
        <form className="form-section" onSubmit={handleSubmit}>
          <h2>Create your account</h2>
          <div className="inputs">
            <FormInput id="fullName" label="Name" />
            <FormInput id="email" label="Email" type="email" />
            <FormInput id="password" label="Password" type="password" />
            <FormInput id="username" label="Username" />
          </div>
          <button className="auth-btn">Sign up</button>
        </form>
      </section>
    </div>
  )
}
