import React from 'react'
import { useGetUserQuery } from '../features/api/api.slice'
import { useGetRouteName } from '../hooks/useGetRouteName'
import { userService } from '../services/user.service'
import { LoginBlock } from './LoginBlock'
import { RandomRegister } from './RandomRegisterBlock'
import { SearchBar } from './SearchBar'
import { Trends } from './Trends'
import { WhoToFollow } from './WhoToFollow'

interface FeedAsideProps {}

export const FeedAside: React.FC<FeedAsideProps> = ({}) => {
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
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
