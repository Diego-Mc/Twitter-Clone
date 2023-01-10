import React from 'react'
import { PostPreview } from './PostPreview'

interface PostListProps {}

export const PostList: React.FC<PostListProps> = ({}) => {
  return (
    <section className="post-list">
      <PostPreview />
      <PostPreview />
      <PostPreview />
      <PostPreview />
      <PostPreview />
    </section>
  )
}
