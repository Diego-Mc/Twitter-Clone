import React, { useState } from 'react'
import { useRegisterMutation } from '../features/api/api.slice'
import { LoadingCircle } from './LoadingCircle'
import { useRandomRegister } from '../hooks/useRandomRegister'
import { toast } from 'react-hot-toast'

interface RandomRegisterBlockProps {}

export const RandomRegister: React.FC<RandomRegisterBlockProps> = ({}) => {
  const [register] = useRegisterMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [triggerRandomRegister] = useRandomRegister()

  const handleRandomRegister = async (): Promise<void> => {
    setIsLoading(true)
    const userCredPrms = triggerRandomRegister()
    toast.promise(userCredPrms, {
      loading: 'Generating user...',
      success: 'Logged in successfully',
      error: 'Unable to generate user',
    })
    register(await userCredPrms)
  }

  return (
    <section className="login-block">
      {isLoading ? (
        <LoadingCircle />
      ) : (
        <>
          <h3 className="title">Here to test the app?</h3>
          <small>
            Click on the button below to instantly log in as a new random user
            for testing purposes!
          </small>
          <div className="login-options">
            <button
              className="auth-btn login-btn"
              onClick={handleRandomRegister}>
              Register test user
            </button>
          </div>
        </>
      )}
    </section>
  )
}
