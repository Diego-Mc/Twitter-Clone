import React from 'react'
import { PostList } from '../components/PostList'
import {
  useGetBookmarksFromUserQuery,
  useGetLoggedInUserQuery,
} from '../features/api/api.slice'
import { UserProps } from '../types/models'

interface BookmarksProps {}

export const Bookmarks: React.FC<BookmarksProps> = ({}) => {
  const { data: user } = useGetLoggedInUserQuery()
  const { data: bookmarks } = useGetBookmarksFromUserQuery(user as UserProps)

  console.log(bookmarks)

  return (
    <section className="bookmarks-view">
      {bookmarks ? <PostList posts={bookmarks} /> : null}
    </section>
  )
}
