import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { FeedAside } from './components/FeedAside'
import { Header } from './components/Header'
import { Sidebar } from './components/Sidebar'
import { Bookmarks } from './views/Bookmarks'
import { Explore } from './views/Explore'
import { Home } from './views/Home'
import { PostDetails } from './views/PostDetails'
import { Profile } from './views/Profile'
import { Search } from './views/Search'

function App() {
  return (
    <BrowserRouter>
      <div className="main-app">
        <Header />
        <Sidebar />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/explore" element={<Explore />} />
            <Route path="/bookmarks" element={<Bookmarks />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/:userId" element={<Profile />} />
            <Route path="/search/:term" element={<Search />} />
            <Route path="/post/:postId" element={<PostDetails />} />
          </Routes>
          <FeedAside />
        </div>
      </div>
    </BrowserRouter>
  )
}

export default App
