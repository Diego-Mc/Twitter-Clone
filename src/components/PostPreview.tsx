import React, { MouseEventHandler, useRef, useState } from 'react'

import { ReactComponent as CommentFilledIcon } from '../assets/icons/comment_filled.svg'
import {
  useGetLoggedInUserQuery,
  useGetPostQuery,
  useLikePostMutation,
} from '../features/api/api.slice'
import { PostProps, UserProps } from '../types/models'
import { utilService } from '../services/util.service'
import { TweetEditPopup } from './TweetEditPopup'
import { userService } from '../services/user.service'
import { Link, useNavigate } from 'react-router-dom'
import { RootState } from '../features/store'
import { Mention } from './Mention'
import { PostActions } from './PostActions'
import { postService } from '../services/post.service'
import { renderToStaticMarkup } from 'react-dom/server'
import { ReactDOM } from 'react'
import { useFormatPost } from '../hooks/useFormatPost'

export interface PostPreviewItemProps {
  post: PostProps
  msg?: {
    type: string
    location: string
    info: {
      username: string | undefined
      fullName: string | undefined
    }
  }
  onComposeClose?: () => void
}

export const PostPreviewItem: React.FC<PostPreviewItemProps> = ({
  post,
  msg,
  onComposeClose,
}) => {
  const navigate = useNavigate()

  const goto = (url: string, ev?: React.MouseEvent) => {
    if (onComposeClose) onComposeClose()
    if (ev) ev.stopPropagation()
    navigate(url)
  }

  const [formatPost] = useFormatPost()

  return (
    <>
      <article
        className="post-preview"
        onClick={() => goto(`/post/${post._id}`)}>
        {msg ? (
          msg.location === 'top' ? (
            <div className="msg-top ">
              <CommentFilledIcon className="group-icon" />
              <p className="group-msg trunc">{msg.info.fullName} replied</p>
            </div>
          ) : (
            <p className="group-msg msg-bottom trunc">
              Replying to&nbsp;
              <Mention
                username={msg.info.username as string}
                onNavigate={onComposeClose}
              />
            </p>
          )
        ) : (
          <>
            <div className="pipe-top"></div>
            <div className="empty"></div>
          </>
        )}
        <section className="left-wrapper">
          <img src={post.composerImgUrl} alt="" className="user-img" />
          <div className="pipe"></div>
        </section>
        <section className="right-wrapper ">
          <span className="header trunc">
            <span
              className="full-name link trunc"
              onClick={(ev) => goto(`/profile/${post.userId}`, ev)}>
              {post.composerFullName}
            </span>
            <span className="username trunc">@{post.composerUsername}</span>
            <span className="divider">·</span>
            <span className="time link">6h</span>
          </span>
          <div className="post-content">
            <p className="post-text">{formatPost(post)}</p>
            {post.imgUrl ? (
              <img src={post.imgUrl} alt="" className="post-img" />
            ) : null}
          </div>
          <PostActions post={post} />
        </section>
      </article>
    </>
  )
}

interface PostPreviewProps {
  post: PostProps
  msgLocation: string
}

export const PostPreview: React.FC<PostPreviewProps> = ({
  post,
  msgLocation,
}) => {
  if (!post.repliedTo) return <PostPreviewItem post={post} />
  const { data: user } = useGetLoggedInUserQuery()
  //TODO: continuew HERE - why user?

  const { data: repliedToPost } = useGetPostQuery(post.repliedTo)
  const topMsgData = {
    type: 'reply',
    location: 'top',
    info: {
      username: user?.username,
      fullName: user?.fullName,
    },
  }
  const bottomMsgData = {
    type: 'reply',
    location: 'bottom',
    info: {
      username: repliedToPost?.composerUsername,
      fullName: repliedToPost?.composerFullName,
    },
  }
  return (
    <section className="post-group">
      {repliedToPost ? (
        <PostPreviewItem
          post={repliedToPost}
          msg={msgLocation === 'top' ? topMsgData : undefined}
        />
      ) : null}
      <PostPreviewItem
        post={post}
        msg={msgLocation === 'bottom' ? bottomMsgData : undefined}
      />
    </section>
  )
}
