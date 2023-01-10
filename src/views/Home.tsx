import React from 'react'
import { PostList } from '../components/PostList'
import { SearchBar } from '../components/SearchBar'
import { Sidebar } from '../components/Sidebar'
import { Trends } from '../components/Trends'
import { WhoToFollow } from '../components/WhoToFollow'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <main className="home-view">
      <nav className="sidebar">
        <Sidebar />
      </nav>
      <PostList />
      <aside className="feed-extras">
        <Trends />
        <WhoToFollow />
      </aside>
    </main>
  )
}
