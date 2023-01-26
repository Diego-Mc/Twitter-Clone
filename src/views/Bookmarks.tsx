import React from 'react'
import { LoadingCircle } from '../components/LoadingCircle'
import { PostList } from '../components/PostList'
import {
  useGetBookmarksFromUserQuery,
  useGetUserQuery,
} from '../features/api/api.slice'
import { userService } from '../services/user.service'
import { UserProps } from '../types/models'

interface BookmarksProps {}

export const Bookmarks: React.FC<BookmarksProps> = ({}) => {
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
  const { data: bookmarks } = useGetBookmarksFromUserQuery(user as UserProps)

  return (
    <section className="bookmarks-view">
      {bookmarks ? <PostList posts={bookmarks} /> : <LoadingCircle />}
    </section>
  )
}
