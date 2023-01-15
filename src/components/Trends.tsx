import React, { useEffect, useState } from 'react'
import { postService } from '../services/post.service'
import { TagProps } from '../types/models'

interface TrendPreviewProps {
  tag: TagProps
}

export const TrendPreview: React.FC<TrendPreviewProps> = ({ tag }) => {
  return (
    <article className="trend-preview">
      <small className="tag">Trending</small>
      <h6 className="trend-name">#{tag.tagName}</h6>
      <small className="tweet-count">{tag.posts?.size || 0} Tweets</small>
    </article>
  )
}

interface TrendsProps {}

export const Trends: React.FC<TrendsProps> = ({}) => {
  const [tags, setTags] = useState<null | TagProps[]>(null)

  useEffect(() => {
    let isCanceled = false

    ;(async () => {
      //get tags (create route)
      //set tags
      setTags([
        { _id: '1', tagName: 'Kimmel', posts: new Map() },
        { _id: '2', tagName: 'Brand', posts: new Map() },
        { _id: '3', tagName: 'Hello', posts: new Map() },
      ])
    })()

    return () => {
      isCanceled = true
    }
  }, [])

  return (
    <section className="trends">
      <h3 className="title">Trends for you</h3>
      <div className="trend-list">
        {tags ? tags.map((t) => <TrendPreview key={t._id} tag={t} />) : null}
      </div>
    </section>
  )
}
