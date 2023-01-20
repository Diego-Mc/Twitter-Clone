import { useEffect, useState } from 'react'
import { Provider, useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
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
import { Profile } from './views/Profile'
import { Search } from './views/Search'
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react'
import { apiSlice } from './features/api/api.slice'
import { EventBus } from './services/eventbus.service'
import { PostProps } from './types/models'

function App() {
  const [tweetPopup, setTweetPopup] = useState(false)
  const [commentPost, setCommentPost] = useState<PostProps | null>(null)

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

  return (
    <BrowserRouter>
      <Provider store={store}>
        <div className="main-app">
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
              <Route path="/" element={<Home />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/bookmarks" element={<Bookmarks />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:userId" element={<Profile />} />
              <Route path="/search/:term" element={<Search />} />
              <Route path="/post/:postId" element={<PostDetails />} />
            </Routes>
          </div>
          <FeedAside />
        </div>
      </Provider>
    </BrowserRouter>
  )
}

export default App
