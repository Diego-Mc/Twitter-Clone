import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFollowUserMutation } from '../features/api/api.slice'
import { UserProps } from '../types/models'

interface UserPreviewProps {
  user: UserProps
}

export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  const [followUser] = useFollowUserMutation()
  const navigate = useNavigate()

  const handleFollow = async () => {
    const res = await followUser(user._id)
    console.log(res)
  }

  const openProfile = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    navigate('/profile/tweets')
  }

  return (
    <article className="user-preview">
      <div className="img-container">
        <img src={user.imgUrl} alt="" className="user-img" />
      </div>
      <div className="preview-content">
        <div className="user-info-container">
          <div className="info">
            <h5 className="full-name link" onClick={openProfile}>
              {user?.fullName}
            </h5>
            <p className="username">@{user?.username}</p>
          </div>
          <button className="follow-btn black pill" onClick={handleFollow}>
            Follow
          </button>
        </div>
        <div className="description">
          <span className="text">{user?.description}</span>
        </div>
      </div>
    </article>
  )
}
