import React from 'react'
import { SearchBar } from './SearchBar'
import { Trends } from './Trends'
import { WhoToFollow } from './WhoToFollow'

interface FeedAsideProps {}

export const FeedAside: React.FC<FeedAsideProps> = ({}) => {
  return (
    <aside className="feed-aside">
      <Trends />
      <WhoToFollow />
    </aside>
  )
}
