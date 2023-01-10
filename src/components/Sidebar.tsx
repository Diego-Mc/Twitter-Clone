import React from 'react'
import { NavLink } from 'react-router-dom'
import { ReactComponent as HomeIcon } from '../assets/icons/home.svg'
import { ReactComponent as HomeIconFilled } from '../assets/icons/home_filled.svg'
import { ReactComponent as ExploreIcon } from '../assets/icons/explore.svg'
import { ReactComponent as ExploreIconFilled } from '../assets/icons/explore_filled.svg'
import { ReactComponent as ProfileIcon } from '../assets/icons/profile.svg'
import { ReactComponent as ProfileIconFilled } from '../assets/icons/profile_filled.svg'
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark.svg'
import { ReactComponent as BookmarkIconFilled } from '../assets/icons/bookmark_filled.svg'
import { UserPreview } from './UserPreview'

interface NavButtonProps {
  type: string
  to: string
  end?: boolean
}

const NavButton: React.FC<NavButtonProps> = ({ type, to, end }) => {
  const icons = {
    home: <HomeIcon />,
    explore: <ExploreIcon />,
    bookmarks: <BookmarkIcon />,
    profile: <ProfileIcon />,
    homeFilled: <HomeIconFilled />,
    exploreFilled: <ExploreIconFilled />,
    bookmarksFilled: <BookmarkIconFilled />,
    profileFilled: <ProfileIconFilled />,
  }

  const getIcon = (isActive: boolean) => {
    const key = type + (isActive ? 'Filled' : '')
    return icons[key as keyof typeof icons]
  }

  return (
    <NavLink to={to} className="btn nav-btn" end={end}>
      {({ isActive }) => (
        <>
          {getIcon(isActive)}
          <p className={isActive ? 'active' : ''}>{type}</p>
        </>
      )}
    </NavLink>
  )
}

interface SidebarProps {}

export const Sidebar: React.FC<SidebarProps> = ({}) => {
  return (
    <section className="sidebar">
      <div className="nav-btns">
        <NavButton to="/" type="home" />
        <NavButton to="/explore" type="explore" />
        <NavButton to="/bookmarks" type="bookmarks" />
        <NavButton to="/profile" type="profile" end />
      </div>
      <button className="tweet-btn primary pill">Tweet</button>
      <UserPreview />
    </section>
  )
}
