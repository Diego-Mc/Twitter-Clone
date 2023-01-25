import React from 'react'
import { useGetLoggedInUserQuery } from '../features/api/api.slice'
import { useGetRouteName } from '../hooks/useGetRouteName'
import { LoginBlock } from './LoginBlock'
import { RandomRegister } from './random-register-block'
import { SearchBar } from './SearchBar'
import { Trends } from './Trends'
import { WhoToFollow } from './WhoToFollow'

interface FeedAsideProps {}

export const FeedAside: React.FC<FeedAsideProps> = ({}) => {
  const { data: user } = useGetLoggedInUserQuery()
  const routeName = useGetRouteName()

  return (
    <aside className={`feed-aside ${routeName}`}>
      {user ? (
        routeName === 'explore' ? (
          <WhoToFollow />
        ) : routeName === 'profile' ? (
          <Trends />
        ) : (
          <>
            <Trends />
            <WhoToFollow />
          </>
        )
      ) : (
        <>
          <LoginBlock />
          <RandomRegister />
        </>
      )}
    </aside>
  )
}
