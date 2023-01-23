import React from 'react'
import { PostList } from '../components/PostList'
import { WhoToFollow } from '../components/WhoToFollow'
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg'
import { Outlet, useParams } from 'react-router-dom'
import {
  useGetLoggedInUserQuery,
  useGetUserLikedPostsQuery,
  useGetUserMediaPostsQuery,
  useGetUserPostsAndRepliesQuery,
  useGetUserPostsQuery,
  useGetUserQuery,
} from '../features/api/api.slice'
import { useProfileTab } from '../hooks/profile'
import { EventBus } from '../services/eventbus.service'
import { userService } from '../services/user.service'

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const [register] = useProfileTab()
  // const { data: user } = useGetLoggedInUserQuery()
  const params = useParams()
  const { data: user } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()._id
  )

  return (
    <section className="profile-view">
      {user ? (
        <>
          <section className="profile-header">
            <section className="cover">
              {user.coverUrl ? <img src={user.coverUrl} /> : null}
              {/* <div className="placeholder">
          Conditionally put this instead of img if none exist
        </div> */}
            </section>

            <section className="details">
              <section className="header">
                <img src={user.imgUrl} className="user-img" />
                <button
                  className="pill white setup-btn"
                  onClick={() => EventBus.$emit('setup-profile')}>
                  Set up profile
                </button>
              </section>

              <section className="info">
                <h3 className="full-name">{user.fullName}</h3>
                <p className="username">@{user.username}</p>
                {user.description ? (
                  <p className="description">{user.description}</p>
                ) : null}
                {user.createdAt ? (
                  <p className="date-info">
                    <>
                      <CalendarIcon className="icon" />
                      Joined{' '}
                      {new Date(user.createdAt).toLocaleString('default', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </>
                  </p>
                ) : null}
                <span className="metadata">
                  <small>
                    <span className="bold">{user.followings.length}</span>
                    Following
                  </small>
                  <small>
                    <span className="bold">{user.followers.length}</span>
                    Followers
                  </small>
                </span>
              </section>
            </section>
          </section>

          <section className="profile-tabs">
            {register('tweets', 'Tweets')}
            {register('replies', 'Tweets & replies')}
            {register('media', 'Media')}
            {register('likes', 'Likes')}
          </section>

          <section className="open-tab">
            <WhoToFollow />
            {/* Add to whotofollow option to show description & change title if needed */}
            {/* <PostList /> */}
            <Outlet />
          </section>
        </>
      ) : null}
    </section>
  )
}

export const TweetsSection: React.FC = () => {
  const { data: user } = useGetLoggedInUserQuery()
  const { data: tweets } = useGetUserPostsQuery(user?._id as string)
  return tweets ? <PostList posts={tweets} /> : null
}

export const TweetsWithRepliesSection: React.FC = () => {
  const { data: user } = useGetLoggedInUserQuery()
  const { data: tweets } = useGetUserPostsAndRepliesQuery(user?._id as string)
  return tweets ? <PostList posts={tweets} /> : null
}

export const MediaTweets: React.FC = () => {
  const { data: user } = useGetLoggedInUserQuery()
  const { data: tweets } = useGetUserMediaPostsQuery(user?._id as string)

  //TODO: media not working - fix backend (currently checking for existence but needs to check for length/regex for url)
  return tweets ? <PostList posts={tweets} /> : null
}

export const LikedTweets: React.FC = () => {
  const { data: user } = useGetLoggedInUserQuery()
  const { data: tweets } = useGetUserLikedPostsQuery(user?._id as string)
  return tweets ? <PostList posts={tweets} /> : null
}
