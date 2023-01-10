import React from 'react'
import { UserPreview } from './UserPreview'

interface WhoToFollowProps {}

export const WhoToFollow: React.FC<WhoToFollowProps> = ({}) => {
  return (
    <section className="who-to-follow">
      <h3 className="title">Who to follow</h3>
      <div className="user-list">
        <UserPreview />
        <UserPreview />
        <UserPreview />
        {/* TODO: UserPreview to have option to show follow button */}
      </div>
    </section>
  )
}
