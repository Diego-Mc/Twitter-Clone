import React from 'react'
import { useNavigate } from 'react-router-dom'
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg'
import { ReactComponent as SparkIcon } from '../assets/icons/spark.svg'
import { SearchBar } from './SearchBar'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  const navigate = useNavigate()
  return (
    <header className="main-header">
      <div className="logo-container" onClick={() => navigate('/')}>
        <LogoIcon />
      </div>
      <div className="main-view">
        <h1 className="view-title">Home</h1>
        <div className="icon-wrap">
          <SparkIcon />
        </div>
      </div>
      <SearchBar />
    </header>
  )
}
