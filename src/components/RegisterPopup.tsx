import React from 'react'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { useRegisterMutation } from '../features/api/api.slice'

interface FormInputProps {
  label: string
  id: string
  type?: string
}

export const FormInputProps: React.FC<FormInputProps> = ({
  label,
  id,
  type = 'text',
}) => {
  return (
    <label className="input-wrapper">
      <p className="placeholder">{label}</p>
      <input
        type={type}
        placeholder=" "
        name={id}
        minLength={6}
        maxLength={50}
      />
    </label>
  )
}

interface RegisterPopupProps {
  onComposeClose: () => void
}

export const RegisterPopup: React.FC<RegisterPopupProps> = ({
  onComposeClose,
}) => {
  const [register] = useRegisterMutation()

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault()
    const formData = new FormData(ev.target as HTMLFormElement)
    const userCred = Object.fromEntries([...formData])
    // TODO: add auth
    register(userCred)
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
          <h2>Create your account</h2>
          <div className="inputs">
            <FormInputProps id="fullName" label="Name" />
            <FormInputProps id="email" label="Email" type="email" />
            <FormInputProps id="password" label="Password" type="password" />
            <FormInputProps id="username" label="Username" />
          </div>
          <button className="auth-btn">Sign up</button>
        </form>
      </section>
    </div>
  )
}
