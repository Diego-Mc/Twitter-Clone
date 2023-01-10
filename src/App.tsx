import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Header } from './components/header'
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
    </BrowserRouter>
  )
}

export default App
