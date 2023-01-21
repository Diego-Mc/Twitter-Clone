import React from 'react'
import { useGetLoggedInUserQuery } from '../features/api/api.slice'
import { LoginBlock } from './LoginBlock'
import { SearchBar } from './SearchBar'
import { Trends } from './Trends'
import { WhoToFollow } from './WhoToFollow'

interface FeedAsideProps {}

export const FeedAside: React.FC<FeedAsideProps> = ({}) => {
  const { data: user } = useGetLoggedInUserQuery()

  return (
    <aside className="feed-aside">
      {user ? (
        <>
          <Trends />
          <WhoToFollow />
        </>
      ) : null}
      {!user ? <LoginBlock /> : null}
    </aside>
  )
}
