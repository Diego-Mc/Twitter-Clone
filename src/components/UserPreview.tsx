import React from 'react'

interface UserPreviewProps {}

export const UserPreview: React.FC<UserPreviewProps> = ({}) => {
  return (
    <article className="user-preview">
      <img src="#" alt="" className="user-img" />
      <h5 className="full-name">Diego Mc</h5>
      <p className="username">@DiegoMonzon99</p>
    </article>
  )
}
