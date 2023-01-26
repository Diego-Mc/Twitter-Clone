import React, { useState } from 'react'
import Chance from 'chance'
import { useRegisterMutation } from '../features/api/api.slice'
import { utilService } from '../services/util.service'
import { uploadImg } from '../services/upload.service'
import { LoadingCircle } from './LoadingCircle'
import { useRandomRegister } from '../hooks/useRandomRegister'
import { toast } from 'react-hot-toast'
const chance = new Chance()

interface RandomRegisterBlockProps {}

export const RandomRegister: React.FC<RandomRegisterBlockProps> = ({}) => {
  const [register] = useRegisterMutation()
  const [isLoading, setIsLoading] = useState(false)
  const [triggerRandomRegister] = useRandomRegister()

  const handleRandomRegister = async () => {
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
