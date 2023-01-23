import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as BackIcon } from '../assets/icons/back.svg'

interface BackIconBtnProps {}

export const BackIconBtn: React.FC<BackIconBtnProps> = ({}) => {
  const navigate = useNavigate()
  const handleBack = () => {
    navigate(-1)
  }

  return (
    <div className="icon-wrap back" onClick={handleBack}>
      <BackIcon />
    </div>
  )
}
