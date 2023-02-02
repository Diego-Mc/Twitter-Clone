import React from 'react'
import { useSearchParams } from 'react-router-dom'
import { LoadingCircle } from '../components/LoadingCircle'
import { PostList } from '../components/PostList'
import { useGetPostsQuery } from '../features/api/api.slice'

interface SearchProps {}

export const Search: React.FC<SearchProps> = ({}) => {
  const [searchParams] = useSearchParams()
  const { data: posts } = useGetPostsQuery(searchParams.toString())

  return (
    <section className="search-view">
      {posts ? <PostList posts={posts} /> : <LoadingCircle />}
    </section>
  )
}
