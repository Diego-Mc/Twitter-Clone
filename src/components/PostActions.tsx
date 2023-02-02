import React from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as HeartFilledIcon } from '../assets/icons/heart_filled.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { ReactComponent as BookmarkIcon } from '../assets/icons/bookmark.svg'
import { ReactComponent as BookmarkFilledIcon } from '../assets/icons/bookmark_filled.svg'
import {
  useBookmarkPostMutation,
  useGetUserQuery,
  useLikePostMutation,
} from '../features/api/api.slice'
import { EventBus } from '../services/eventbus.service'
import { userService } from '../services/user.service'
import { PostProps } from '../types/models'
import {
  createSearchParams,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom'
import { useGetRouteName } from '../hooks/useGetRouteName'
import { toast } from 'react-hot-toast'

interface IPostActions {
  PostActionsProps: {
    post: PostProps
  }
  searchData: {
    user?: string
    filter: string
  }
}

//TODO: break into components

export const PostActions: React.FC<IPostActions['PostActionsProps']> = ({
  post,
}) => {
  const [likePost] = useLikePostMutation()
  const [bookmarkPost] = useBookmarkPostMutation()
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
  const route = useGetRouteName()
  const params = useParams()
  const location = useLocation()

  //TODO: check "as" cases
  const isLiked = user !== undefined && post.likes[user._id as string]
  const [searchParams] = useSearchParams()

  const isBookmarked = user?.bookmarks.includes(post._id)

  const getSearchParams = (): string | void => {
    if (route === 'search') return searchParams.toString()
    else if (route !== 'profile') return

    const locSplit = location.pathname.split('/')
    let filter = ''
    let user = ''
    if (params?.userId) {
      filter = locSplit[3]
      user = params.userId
    } else {
      filter = locSplit[2]
      user = userService.getLoggedInUser()?._id
    }
    const data: IPostActions['searchData'] = { user, filter }
    if (data.user === undefined) delete data.user
    return createSearchParams(data).toString()
  }

  const handleLike = (ev: React.MouseEvent): void => {
    ev.stopPropagation()
    const searchParams = getSearchParams()
    likePost({ post, params: searchParams, user })
  }

  const handleComment = (ev: React.MouseEvent): void => {
    ev.stopPropagation()
    EventBus.$emit('comment', post)
  }

  const handleShare = async (ev: React.MouseEvent): Promise<void> => {
    ev.stopPropagation()
    const postUrl = window.location.origin + '/post/' + post._id
    const copyPrms = navigator.clipboard.writeText(postUrl)
    toast.promise(copyPrms, {
      loading: 'Copying...',
      success: 'Copied',
      error: 'Unable to copy',
    })
    await copyPrms
  }

  const handleBookmark = (ev: React.MouseEvent): void => {
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
