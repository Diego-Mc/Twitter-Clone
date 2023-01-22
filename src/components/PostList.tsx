import React from 'react'
import { PostProps } from '../types/models'
import { PostPreview } from './PostPreview'

interface PostListProps {
  posts: PostProps[]
}

export const PostList: React.FC<PostListProps> = ({ posts }) => {
  return (
    <section className="post-list">
      {posts.map((post) =>
        post ? (
          <PostPreview post={post} key={post._id} msgLocation="top" />
        ) : null
      )}
    </section>
  )
}
