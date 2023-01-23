import React from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg'
import { ReactComponent as SparkIcon } from '../assets/icons/spark.svg'
import { ReactComponent as BackIcon } from '../assets/icons/back.svg'
import { useGetLoggedInUserQuery } from '../features/api/api.slice'
import { SearchBar } from './SearchBar'
import { BackIconBtn } from './BackIconBtn'
import { useGetRouteName } from '../hooks/useGetRouteName'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const navigate = useNavigate()
  const routeName = useGetRouteName()
  const { data: user } = useGetLoggedInUserQuery()

  return (
    <header className={`main-header ${routeName}`}>
      <div className="logo-container" onClick={() => navigate('/')}>
        <LogoIcon />
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
            {user ? (
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
