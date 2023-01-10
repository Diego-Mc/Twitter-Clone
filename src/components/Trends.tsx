import React from 'react'

interface TrendPreviewProps {}

export const TrendPreview: React.FC<TrendPreviewProps> = ({}) => {
  return (
    <article className="trend-preview">
      <small className="tag">Trending</small>
      <h6 className="trend-name">Kimmel</h6>
      <small className="tweet-count">2,734 Tweets</small>
    </article>
  )
}

interface TrendsProps {}

export const Trends: React.FC<TrendsProps> = ({}) => {
  return (
    <section className="trends">
      <h3 className="title">Trends for you</h3>
      <div className="trend-list">
        <TrendPreview />
        <TrendPreview />
        <TrendPreview />
        <TrendPreview />
        <TrendPreview />
        <TrendPreview />
      </div>
    </section>
  )
}
