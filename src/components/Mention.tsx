import React from 'react'
import { Link } from 'react-router-dom'
import { useGetUserIdQuery } from '../features/api/api.slice'

interface MentionProps {
  username: string
  onNavigate?: () => void
}

export const Mention: React.FC<MentionProps> = ({ username, onNavigate }) => {
  const { data: userId } = useGetUserIdQuery(username)

  const handleLinkClick = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    if (onNavigate) onNavigate()
  }
  return (
    <Link
      className="mention"
      to={userId ? `/profile/${userId}` : '#'}
      onClick={handleLinkClick}>
      @{username}
    </Link>
  )
}
