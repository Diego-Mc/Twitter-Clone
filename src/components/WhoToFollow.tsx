import React from 'react'
import { useGetRandomUsersToFollowQuery } from '../features/api/api.slice'
import { LoadingCircle } from './LoadingCircle'
import { UserPreview } from './UserPreview'

interface WhoToFollowProps {}

export const WhoToFollow: React.FC<WhoToFollowProps> = ({}) => {
  const { data: usersToFollow } = useGetRandomUsersToFollowQuery()

  if (!usersToFollow)
    return (
      <section className="who-to-follow">
        <h3 className="title">Who to follow</h3>
        <div className="user-list">
          <LoadingCircle />
        </div>
      </section>
    )
  if (usersToFollow.length === 0) return null

  return (
    <section className="who-to-follow">
      <h3 className="title">Who to follow</h3>
      <div className="user-list">
        {usersToFollow?.map((u) => (
          <UserPreview key={u._id} user={u} />
        ))}
        {/* TODO: UserPreview to have option to show follow button */}
      </div>
    </section>
  )
}
