import React from 'react'
import { PostList } from '../components/PostList'

interface BookmarksProps {}

export const Bookmarks: React.FC<BookmarksProps> = ({}) => {
  return (
    <section className="bookmarks-view">
      <PostList />
    </section>
  )
}
