import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg'

interface SearchBarProps {}

type FormEventProps = React.FormEvent & {
  target: { search?: HTMLInputElement }
}

export const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const navigate = useNavigate()

  const handleSearch = (ev: FormEventProps) => {
    ev.preventDefault()
    if (!ev.target?.search?.value) return

    const filterBy = { search: ev.target.search.value }
    navigate({
      pathname: '/search',
      search: `?${createSearchParams(filterBy)}`,
    })
  }

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <SearchIcon />
      <input type="text" name="search" placeholder="Search Twitter" />
    </form>
  )
}
