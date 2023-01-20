import React, { useState } from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as HeartFilledIcon } from '../assets/icons/heart_filled.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { useLikePostMutation } from '../features/api/api.slice'
import { EventBus } from '../services/eventbus.service'
import { userService } from '../services/user.service'
import { PostProps } from '../types/models'
import { TweetEditPopup } from './TweetEditPopup'

interface PostActionsProps {
  post: PostProps
}

export const PostActions: React.FC<PostActionsProps> = ({ post }) => {
  const [likePost] = useLikePostMutation()

  const isLiked = post.likes[userService.getLoggedInUser()._id]

  const handleLike = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    likePost(post._id)
  }

  const handleComment = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    EventBus.$emit('comment', post)
  }

  const handleShare = (ev: React.MouseEvent) => {
    ev.stopPropagation()
  }

  return (
    <>
      <div className="options">
        <div className="icon comment" onClick={handleComment}>
          <div className="icon-wrap sm">
            <CommentIcon />
          </div>
          <span className="amount">{post.replies.length}</span>
        </div>
        <div
          className={`icon like ${isLiked ? 'selected' : null}`}
          onClick={handleLike}>
          <div className="icon-wrap sm">
            {isLiked ? <HeartFilledIcon /> : <HeartIcon />}
          </div>
          <span className="amount">{Object.keys(post.likes).length}</span>
        </div>
        <div className="icon share" onClick={handleShare}>
          <div className="icon-wrap sm">
            <ShareIcon />
          </div>
        </div>
      </div>
    </>
  )
}
