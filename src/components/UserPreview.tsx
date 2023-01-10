import React from 'react'

interface UserPreviewProps {}

export const UserPreview: React.FC<UserPreviewProps> = ({}) => {
  return (
    <article className="user-preview">
      <img src="default-user-img.png" alt="" className="user-img" />
      <h5 className="full-name">Diego Mc</h5>
      <p className="username">@DiegoMc99</p>
      <button className="follow-btn black pill">Follow</button>
    </article>
  )
}
