import React, { useRef } from 'react'
import { PostList } from '../components/PostList'
import { Trends } from '../components/Trends'
import {
  useGetTrendPostsQuery,
  useGetTrendsQuery,
} from '../features/api/api.slice'
import { ReactComponent as ExploreTitleIcon } from '../assets/icons/explore-title.svg'
import { PostProps } from '../types/models'
import { LoadingCircle } from '../components/LoadingCircle'

interface ExploreProps {}

export const Explore: React.FC<ExploreProps> = ({}) => {
  const { data: trendSections } = useGetTrendPostsQuery()

  return (
    <section className="explore-view">
      <Trends />
      {trendSections ? (
        trendSections.map(({ title, posts }: any) => (
          <section className="trend-section" key={title}>
            <header className="trend-header">
              <ExploreTitleIcon />
              <h3 className="title">{title}</h3>
            </header>
            <PostList posts={posts} />
          </section>
        ))
      ) : (
        <LoadingCircle />
      )}
    </section>
  )
}

// TODO: add to response tag headers & use them as keys
// TODO: add lodash to remove duplicates and even limit each section to 3-4 posts in backend
