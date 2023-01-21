import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { PostList } from '../components/PostList'
import { useGetPostsQuery } from '../features/api/api.slice'
import { useGetParams } from '../hooks/useGetParams'

interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [params] = useGetParams(searchParams)
  console.log(params)
  const { data: posts } = useGetPostsQuery(params)

  return (
    <section className="search-view">
      {posts ? <PostList posts={posts} /> : null}
    </section>
  )
}
