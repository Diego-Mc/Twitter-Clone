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
  const { data: trends, isSuccess } = useGetTrendsQuery()
  const { data } = useGetTrendPostsQuery(trends)

  return (
    <section className="explore-view">
      <Trends />
      {data
        ? data.map((trendPosts: Array<PostProps>) =>
            trendPosts ? (
              <PostList posts={trendPosts} key={JSON.stringify(trendPosts)} />
            ) : null
          )
        : null}
    </section>
  )
}

// TODO: add to response tag headers & use them as keys
// TODO: add lodash to remove duplicates and even limit each section to 3-4 posts in backend
