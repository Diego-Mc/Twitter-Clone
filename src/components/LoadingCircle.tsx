import React from 'react'

interface LoadingCircleProps {}

export const LoadingCircle: React.FC<LoadingCircleProps> = ({}) => {
  return (
    <div className="loading-circle-container">
      <div className="loading-circle"></div>
    </div>
  )
}
