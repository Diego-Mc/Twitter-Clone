import React, { MouseEventHandler, useState } from 'react'

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
import { useNavigate } from 'react-router-dom'
import { RootState } from '../features/store'
import { Mention } from './Mention'
import { PostActions } from './PostActions'
import { postService } from '../services/post.service'

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
}

export const PostPreviewItem: React.FC<PostPreviewItemProps> = ({
  post,
  msg,
}) => {
  const navigate = useNavigate()

  const generatePostHtml = () => {
    const hashtags = utilService.getHashtags(post.text)
    let html = post.text
    for (const hashtag of hashtags) {
      html = html.replace(
        hashtag,
        `<a class="tag" href="testing!!">${hashtag}</a>`
      )
    }
    return html
  }

  return (
    <>
      <article
        className={`post-preview ${msg ? `with-msg ${msg.location}` : null}`}
        onClick={() => navigate(`/post/${post._id}`)}>
        {msg ? (
          msg.location === 'top' ? (
            <>
              <CommentFilledIcon className="group-icon" />
              <p className="group-msg">{msg.info.fullName} replied</p>
            </>
          ) : (
            <p className="group-msg">
              Replying to <Mention username={msg.info.username as string} />
            </p>
          )
        ) : null}
        <img src={post.composerImgUrl} alt="" className="user-img" />
        <span className="header">
          <span className="full-name link">{post.composerFullName}</span>
          <span className="username">@{post.composerUsername}</span>
          <span className="divider">·</span>
          <span className="time link">6h</span>
        </span>
        <div className="post-content">
          <p
            className="post-text"
            dangerouslySetInnerHTML={{
              __html: postService.generatePostHtml(post),
            }}></p>
          {post.imgUrl ? (
            <img src={post.imgUrl} alt="" className="post-img" />
          ) : null}
        </div>
        <PostActions post={post} />
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
