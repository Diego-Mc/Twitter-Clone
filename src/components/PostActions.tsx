import React, { useState } from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as HeartFilledIcon } from '../assets/icons/heart_filled.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark.svg'
import { ReactComponent as BookmarkFilledIcon } from '../assets/icons/bookmark_filled.svg'
import {
  useBookmarkPostMutation,
  useGetLoggedInUserQuery,
  useLikePostMutation,
} from '../features/api/api.slice'
import { EventBus } from '../services/eventbus.service'
import { userService } from '../services/user.service'
import { PostProps, UserProps } from '../types/models'
import { TweetEditPopup } from './TweetEditPopup'
import { RootState } from '../features/store'
import {
  createSearchParams,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useGetRouteName } from '../hooks/useGetRouteName'

interface PostActionsProps {
  post: PostProps
}

export const PostActions: React.FC<PostActionsProps> = ({ post }) => {
  const [likePost] = useLikePostMutation()
  const [bookmarkPost] = useBookmarkPostMutation()
  const { data: user } = useGetLoggedInUserQuery()
  const route = useGetRouteName()
  const params = useParams()
  const location = useLocation()

  const isLiked = user !== undefined && post.likes[user._id as string]
  const [searchParams] = useSearchParams()

  const isBookmarked = user?.bookmarks.includes(post._id)

  const handleLike = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    // console.log('dffdsfs', params, location.pathname.split('/')[3])
    let searchObj: any = undefined
    if (route === 'search') searchObj = searchParams.toString()
    else if (route === 'profile') {
      if (params.userId) {
        const filter = location.pathname.split('/')[3]
        const user = params.userId
        searchObj = { user, filter }
      } else {
        const filter = location.pathname.split('/')[3]
        const user = params.userId
        searchObj = { user, filter }
      }
      if (searchObj.user === undefined) delete searchObj.user
      searchObj = createSearchParams(searchObj).toString()
    }

    likePost({ post, params: searchObj, user })
  }

  const handleComment = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    EventBus.$emit('comment', post)
  }

  const handleShare = (ev: React.MouseEvent) => {
    ev.stopPropagation()
  }

  const handleBookmark = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    bookmarkPost(post._id)
  }

  return (
    <>
      <div className="options">
        <article className="icon-container">
          <div className="icon comment" onClick={handleComment}>
            <div className="icon-wrap sm">
              <CommentIcon />
            </div>
            <span className="amount">{post.replies.length}</span>
          </div>
        </article>

        <article className="icon-container">
          <div
            className={`icon like ${isLiked ? 'selected' : null}`}
            onClick={handleLike}>
            <div className="icon-wrap sm">
              {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
            </div>
            <span className="amount">{Object.keys(post.likes).length}</span>
          </div>
        </article>

        <article className="icon-container">
          <div className="icon share" onClick={handleShare}>
            <div className="icon-wrap sm">
              <ShareIcon />
            </div>
          </div>
        </article>

        <article className="icon-container">
          <div
            className={`icon bookmark ${isBookmarked ? 'selected' : null}`}
            onClick={handleBookmark}>
            <div className="icon-wrap sm">
              {isBookmarked ? <BookmarkFilledIcon /> : <BookmarkIcon />}
            </div>
          </div>
        </article>
      </div>
    </>
  )
}
