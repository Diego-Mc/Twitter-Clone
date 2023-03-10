import React from 'react'
import { createSearchParams, useNavigate } from 'react-router-dom'
import { useGetTrendsQuery } from '../features/api/api.slice'
import { TagProps } from '../types/models'
import { LoadingCircle } from './LoadingCircle'

//TODO: move to components

interface TrendPreviewProps {
  tag: TagProps
}

export const TrendPreview: React.FC<TrendPreviewProps> = ({ tag }) => {
  const navigate = useNavigate()

  const handleTrendSelect = () =>
    navigate({
      pathname: '/search',
      search: `?${createSearchParams({ search: tag.tagName })}`,
    })

  return (
    <article className="trend-preview" onClick={handleTrendSelect}>
      <small className="tag">Trending</small>
      <h6 className="trend-name trunc">#{tag.tagName}</h6>
      <small className="tweet-count">
        {Object.keys(tag.posts).length} Tweets
      </small>
    </article>
  )
}

interface TrendsProps {}

export const Trends: React.FC<TrendsProps> = ({}) => {
  const { data: trends } = useGetTrendsQuery()

  //TODO: move map to function
  return (
    <section className="trends">
      <h3 className="title">Trends for you</h3>
      <div className="trend-list">
        {trends ? (
          trends.map((t) => <TrendPreview key={t._id} tag={t} />)
        ) : (
          <LoadingCircle />
        )}
      </div>
    </section>
  )
}
