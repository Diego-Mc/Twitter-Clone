import React from 'react'
import { PostList } from '../components/PostList'
import { WhoToFollow } from '../components/WhoToFollow'
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg'
import {
  matchRoutes,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom'
import {
  useGetLoggedInUserQuery,
  useGetUserLikedPostsQuery,
  useGetUserMediaPostsQuery,
  useGetUserPostsAndRepliesQuery,
  useGetUserPostsQuery,
} from '../features/api/api.slice'
import { UserProps } from '../types/models'
import { useProfileTab } from '../hooks/profile'

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  const [register] = useProfileTab()

  return (
    <section className="profile-view">
      <section className="profile-header">
        <section className="cover">
          <img src="/cover-example.jpeg" alt="cover" />
          {/* <div className="placeholder">
          Conditionally put this instead of img if none exist
        </div> */}
        </section>

        <section className="details">
          <section className="header">
            <img src="/default-user-img.png" alt="" className="user-img" />
            <button className="pill white setup-btn">Set up profile</button>
          </section>

          <section className="info">
            <h3 className="full-name">Diego Mc</h3>
            <p className="username">@DiegoMc99</p>
            <p className="date-info">
              <CalendarIcon className="icon" />
              Joined October 2022
            </p>
            <span className="metadata">
              <small>
                <span className="bold">32</span>
                Following
              </small>
              <small>
                <span className="bold">1</span>
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
