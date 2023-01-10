import React from 'react'
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg'

interface SearchBarProps {}

export const SearchBar: React.FC<SearchBarProps> = ({}) => {
  return (
    <form className="search-bar">
      <SearchIcon />
      <input type="text" placeholder="Search Twitter" />
    </form>
  )
}
