import React from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg'
import { useGetUserQuery } from '../features/api/api.slice'
import { SearchBar } from './SearchBar'
import { BackIconBtn } from './BackIconBtn'
import { useGetRouteName } from '../hooks/useGetRouteName'
import { userService } from '../services/user.service'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const navigate = useNavigate()
  const routeName = useGetRouteName()

  //TODO: break to hook
  let params = useLocation().pathname.split('/') // => ""/profile/:userId/tweets
  let userId = params[3] ? params[2] : userService.getLoggedInUser()?._id

  const { data: user, isFetching } = useGetUserQuery(userId)

  //TODO: rewrite clearly
  return (
    <header className={`main-header ${routeName}`}>
      <div className="logo-wrapper">
        <div className="logo-container" onClick={() => navigate('/')}>
          <LogoIcon />
        </div>
      </div>
      {routeName === 'explore' ? (
        <>
          <div className="main-view">
            <SearchBar />
          </div>
        </>
      ) : routeName === 'bookmarks' ? (
        <>
          <div className="main-view">
            <div className="heading">
              <h1 className="view-title">Bookmarks</h1>
              {user ? <small>@{user.username}</small> : null}
            </div>
          </div>
          <SearchBar />
        </>
      ) : routeName === 'profile' ? (
        <>
          <div className="main-view">
            <BackIconBtn />
            {user && !isFetching ? (
              <div className="heading">
                <h1 className="view-title">{user.fullName}</h1>
                <small>@{user.username}</small>
              </div>
            ) : null}
          </div>
          <SearchBar />
        </>
      ) : routeName === 'search' ? (
        <>
          <div className="main-view">
            <BackIconBtn />
            <SearchBar />
          </div>
        </>
      ) : routeName === 'post' ? (
        <>
          <div className="main-view">
            <BackIconBtn />
            <div className="heading">
              <h1 className="view-title">Thread</h1>
            </div>
          </div>
          <SearchBar />
        </>
      ) : (
        <>
          <div className="main-view">
            <h1 className="view-title">Home</h1>
          </div>
          <SearchBar />
        </>
      )}
    </header>
  )
}
