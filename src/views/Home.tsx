import React from 'react'
import { PostList } from '../components/PostList'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <main className="home-view">
      <PostList />
    </main>
  )
}
