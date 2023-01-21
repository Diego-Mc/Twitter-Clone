import { useEffect, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { FeedAside } from './components/FeedAside'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { TweetEditPopup } from './components/TweetEditPopup'
import { RootState, store } from './features/store'
import { initUser } from './features/user/user.slice'
import { userService } from './services/user.service'
import { Bookmarks } from './views/Bookmarks'
import { Explore } from './views/Explore'
import { Home } from './views/Home'
import { PostDetails } from './views/PostDetails'
import {
  LikedTweets,
  MediaTweets,
  Profile,
  TweetsSection,
  TweetsWithRepliesSection,
} from './views/Profile'
import { Search } from './views/Search'
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react'
import { apiSlice, useGetLoggedInUserQuery } from './features/api/api.slice'
import { EventBus } from './services/eventbus.service'
import { PostProps } from './types/models'
import { LoginPopup } from './components/LoginPopup'
import { RegisterPopup } from './components/RegisterPopup'

function App() {
  const [loginPopup, setLoginPopup] = useState(false)
  const [registerPopup, setRegisterPopup] = useState(false)
  const [tweetPopup, setTweetPopup] = useState(false)
  const [commentPost, setCommentPost] = useState<PostProps | null>(null)
  const { data: user } = useGetLoggedInUserQuery()

  const toggleTweetPopup = (force: boolean) => {
    setTweetPopup(force ?? !tweetPopup)
  }

  const toggleCommentPopup = (force: boolean) => {
    if (!force) setCommentPost(null)
  }

  useEffect(() => {
    const cb = (post: PostProps) => setCommentPost(post)
    EventBus.$on('comment', cb)
    return EventBus.$off('comment', cb)
  }, [])

  useEffect(() => {
    const cb = () => setLoginPopup(true)
    EventBus.$on('login-select', cb)
    return EventBus.$off('login-select', cb)
  }, [])

  useEffect(() => {
    const cb = () => setRegisterPopup(true)
    EventBus.$on('register-select', cb)
    return EventBus.$off('register-select', cb)
  }, [])

  return (
    <BrowserRouter>
      <div className="main-app">
        {registerPopup ? (
          <RegisterPopup onComposeClose={() => setRegisterPopup(false)} />
        ) : null}

        {loginPopup ? (
          <LoginPopup onComposeClose={() => setLoginPopup(false)} />
        ) : null}

        {tweetPopup ? (
          <TweetEditPopup onComposeClose={() => toggleTweetPopup(false)} />
        ) : null}

        {commentPost ? (
          <TweetEditPopup
            replyingTo={commentPost}
            onComposeClose={() => toggleCommentPopup(false)}
          />
        ) : null}

        <Header />
        <Sidebar onComposeTweet={() => toggleTweetPopup(true)} />
        <div className="main-content">
          <Routes>
            {!user ? (
              <>
                <Route path="*" element={<Navigate to="/explore" replace />} />
                <Route path="/explore" element={<Explore />} />
              </>
            ) : (
              <>
                <Route path="/" element={<Home />} />
                <Route path="/explore" element={<Explore />} />
                <Route path="/bookmarks" element={<Bookmarks />} />
                <Route
                  path="/profile"
                  element={<Navigate to="tweets" replace />}
                />
                <Route
                  path="/profile/:userId"
                  element={<Navigate to="tweets" replace />}
                />
                <Route path="/profile" element={<Profile />}>
                  <Route path="tweets" element={<TweetsSection />} />
                  <Route
                    path="replies"
                    element={<TweetsWithRepliesSection />}
                  />
                  <Route path="media" element={<MediaTweets />} />
                  <Route path="likes" element={<LikedTweets />} />
                </Route>
                <Route path="/profile/:userId" element={<Profile />}>
                  <Route path="tweets" element={<TweetsSection />} />
                  <Route
                    path="replies"
                    element={<TweetsWithRepliesSection />}
                  />
                  <Route path="media" element={<MediaTweets />} />
                  <Route path="likes" element={<LikedTweets />} />
                </Route>
                <Route path="/search" element={<Search />} />
                <Route path="/post/:postId" element={<PostDetails />} />
              </>
            )}
          </Routes>
        </div>
        <FeedAside />
      </div>
    </BrowserRouter>
  )
}

export default App
