import React from 'react'
import { useGetTrendsQuery } from '../features/api/api.slice'
import { TagProps } from '../types/models'

interface TrendPreviewProps {
  tag: TagProps
}

export const TrendPreview: React.FC<TrendPreviewProps> = ({ tag }) => {
  return (
    <article className="trend-preview">
      <small className="tag">Trending</small>
      <h6 className="trend-name">{tag.tagName}</h6>
      <small className="tweet-count">
        {Object.keys(tag.posts).length} Tweets
      </small>
    </article>
  )
}

interface TrendsProps {}

export const Trends: React.FC<TrendsProps> = ({}) => {
  const { data: trends } = useGetTrendsQuery()
  return (
    <section className="trends">
      <h3 className="title">Trends for you</h3>
      <div className="trend-list">
        {trends
          ? trends.map((t) => <TrendPreview key={t._id} tag={t} />)
          : null}
      </div>
    </section>
  )
}
