import React, { useEffect } from 'react'
import { PostList } from '../components/PostList'
import { WhoToFollow } from '../components/WhoToFollow'
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg'
import {
  createSearchParams,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  useFollowUserMutation,
  useGetPostsQuery,
  useGetUserQuery,
} from '../features/api/api.slice'
import { useProfileTab } from '../hooks/profile'
import { EventBus } from '../services/eventbus.service'
import { userService } from '../services/user.service'
import { LoadingCircle } from '../components/LoadingCircle'

//TODO: break to components

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const [register] = useProfileTab()
  const navigate = useNavigate()
  const [followUser] = useFollowUserMutation()
  let params = useParams()
  const { data: user, isFetching } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()?._id
  )

  useEffect(() => {
    if (params?.userId === userService.getLoggedInUser()?._id) {
      navigate('/profile/tweets', { replace: true })
    }
  }, [params?.userId])

  const handleFollow = () => {
    followUser(user?._id)
  }

  return (
    <section className="profile-view">
      {isFetching ? <LoadingCircle /> : null}
      {user && !isFetching ? (
        <>
          <section className="profile-header">
            <section className="cover">
              {user.coverUrl ? <img src={user.coverUrl} /> : null}
            </section>

            <section className="details">
              <section className="header">
                <img src={user.imgUrl} className="user-img" />
                {user._id === userService.getLoggedInUser()._id ? (
                  <button
                    className="pill white setup-btn"
                    onClick={() => EventBus.$emit('setup-profile')}>
                    Set up profile
                  </button>
                ) : user.followers.includes(
                    userService.getLoggedInUser()._id
                  ) ? (
                  <button
                    className="pill white setup-btn"
                    onClick={handleFollow}>
                    Following
                  </button>
                ) : (
                  <button
                    className="follow-btn black pill"
                    onClick={handleFollow}>
                    Follow
                  </button>
                )}
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
            {userService.getLoggedInUser()?._id ? <WhoToFollow /> : null}
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
  const params = useParams()
  const { data: user } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()?._id
  )
  if (!user?._id) return null
  const criteria = { user: user._id, filter: 'tweets' }
  const query = createSearchParams(criteria).toString()
  const { data: tweets } = useGetPostsQuery(query)
  return tweets ? <PostList posts={tweets} /> : <LoadingCircle />
}

export const TweetsWithRepliesSection: React.FC = () => {
  const params = useParams()
  const { data: user } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()?._id
  )
  if (!user?._id) return null
  const criteria = { user: user._id, filter: 'replies' }
  const query = createSearchParams(criteria).toString()
  const { data: tweets } = useGetPostsQuery(query)
  return tweets ? <PostList posts={tweets} /> : <LoadingCircle />
}

export const MediaTweets: React.FC = () => {
  const params = useParams()
  const { data: user } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()?._id
  )
  if (!user?._id) return null
  const criteria = { user: user._id, filter: 'media' }
  const query = createSearchParams(criteria).toString()
  const { data: tweets } = useGetPostsQuery(query)
  return tweets ? <PostList posts={tweets} /> : <LoadingCircle />
}

export const LikedTweets: React.FC = () => {
  const params = useParams()
  const { data: user } = useGetUserQuery(
    params?.userId || userService.getLoggedInUser()?._id
  )
  if (!user?._id) return null
  const criteria = { user: user._id, filter: 'likes' }
  const query = createSearchParams(criteria).toString()
  const { data: tweets } = useGetPostsQuery(query)
  return tweets ? <PostList posts={tweets} /> : <LoadingCircle />
}
