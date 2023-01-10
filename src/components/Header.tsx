import React from 'react'
import { ReactComponent as LogoIcon } from '../assets/icons/logo.svg'
import { ReactComponent as SparkIcon } from '../assets/icons/spark.svg'
import { SearchBar } from './SearchBar'

interface HeaderProps {}

export const Header: React.FC<HeaderProps> = ({}) => {
  return (
    <header className="main-header">
      <div className="logo-container">
        <LogoIcon />
      </div>
      <div className="main-view">
        <h1 className="view-title">Home</h1>
        <SparkIcon />
      </div>
      <SearchBar />
    </header>
  )
}
