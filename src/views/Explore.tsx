import React, { useRef } from 'react'
import { PostList } from '../components/PostList'
import { Trends } from '../components/Trends'
import {
  useGetTrendPostsQuery,
  useGetTrendsQuery,
} from '../features/api/api.slice'
import { PostProps } from '../types/models'

interface ExploreProps {}

export const Explore: React.FC<ExploreProps> = ({}) => {
  // const { data: trends, isSuccess } = useGetTrendsQuery()
  const { data } = useGetTrendPostsQuery('ya')
  // const posts = useRef<Array<PostProps[]>>([])

  // if (isSuccess) {
  console.log(data)
  // }

  return (
    <section className="explore-view">
      {/* <Trends /> */}
      {/* <PostList /> */}
    </section>
  )
}
