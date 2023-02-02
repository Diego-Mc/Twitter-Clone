import React from 'react'
import { LoadingCircle } from '../components/LoadingCircle'
import { PostPreviewItem } from '../components/PostPreview'
import {
  useGetBookmarksFromUserQuery,
  useGetUserQuery,
} from '../features/api/api.slice'
import { userService } from '../services/user.service'
import { PostProps, UserProps } from '../types/models'

interface BookmarksProps {}

export const Bookmarks: React.FC<BookmarksProps> = ({}) => {
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
  //TODO: is this right?
  const { data: bookmarks } = useGetBookmarksFromUserQuery(user as UserProps)

  //TODO: move map to function
  return (
    <section className="bookmarks-view">
      {bookmarks ? (
        bookmarks.map((post: PostProps) => (
          <PostPreviewItem key={post._id} post={post} />
        ))
      ) : (
        <LoadingCircle />
      )}
    </section>
  )
}
