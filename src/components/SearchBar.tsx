import React, { useEffect, useState } from 'react'
import {
  createSearchParams,
  useNavigate,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { ReactComponent as SearchIcon } from '../assets/icons/search.svg'

interface SearchBarProps {}

type FormEventProps = React.FormEvent & {
  target: { search?: HTMLInputElement }
}

export const SearchBar: React.FC<SearchBarProps> = ({}) => {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const [searchValue, setSearchValue] = useState(
    searchParams?.get('search') || ''
  )

  const handleSearch = (ev: FormEventProps) => {
    ev.preventDefault()
    if (!searchValue) return

    const filterBy = { search: searchValue }
    navigate({
      pathname: '/search',
      search: `?${createSearchParams(filterBy)}`,
    })
  }

  useEffect(() => {
    setSearchValue(searchParams?.get('search') || '')
  }, [searchParams?.get('search')])

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <SearchIcon />
      <input
        type="text"
        name="search"
        placeholder="Search Twitter"
        value={searchValue}
        onChange={(ev) => setSearchValue(ev.target.value)}
      />
    </form>
  )
}
