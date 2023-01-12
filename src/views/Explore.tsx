import React from 'react'
import { PostList } from '../components/PostList'
import { Trends } from '../components/Trends'

interface ExploreProps {}

export const Explore: React.FC<ExploreProps> = ({}) => {
  return (
    <section className="explore-view">
      <Trends />
      <PostList />
    </section>
  )
}
