import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useFollowUserMutation } from '../features/api/api.slice'
import { userService } from '../services/user.service'
import { UserProps } from '../types/models'

interface UserPreviewProps {
  user: UserProps
}

export const UserPreview: React.FC<UserPreviewProps> = ({ user }) => {
  const [followUser] = useFollowUserMutation()
  const navigate = useNavigate()

  const handleFollow = () => {
    followUser(user._id)
  }

  const openProfile = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    navigate(`/profile/${user._id}`)
  }

  return (
    <article className="user-preview">
      <div className="img-container">
        <img src={user.imgUrl} alt="" className="user-img" />
      </div>
      <div className="preview-content">
        <div className="user-info-container">
          <div className="info">
            <h5 className="full-name link trunc" onClick={openProfile}>
              {user?.fullName}
            </h5>
            <p className="username trunc">@{user?.username}</p>
          </div>
          {user.followers.includes(userService.getLoggedInUser()._id) ? (
            <button className="pill white setup-btn" onClick={handleFollow}>
              Following
            </button>
          ) : (
            <button className="follow-btn black pill" onClick={handleFollow}>
              Follow
            </button>
          )}
        </div>
        <div className="description">
          <span className="text">{user?.description}</span>
        </div>
      </div>
    </article>
  )
}
