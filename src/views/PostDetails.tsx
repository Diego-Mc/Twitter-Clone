import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  PostOptionsPopup,
  PostPreviewItem,
  PostPreviewItemProps,
} from '../components/PostPreview'

import { TweetEdit } from '../components/TweetEdit'
import {
  useGetPostQuery,
  useGetPostRepliesQuery,
} from '../features/api/api.slice'
import { Mention } from '../components/Mention'
import { PostActions } from '../components/PostActions'
import { LoadingCircle } from '../components/LoadingCircle'
import { useFormatPost } from '../hooks/useFormatPost'
import { ReactComponent as OptionsIcon } from '../assets/icons/options.svg'

//TODO: break to components

export const MainPost: React.FC<PostPreviewItemProps> = ({ post, msg }) => {
  const [formatPost] = useFormatPost()
  const navigate = useNavigate()
  const [postPopup, setPostPopup] = useState(false)

  //TODO: appeared before - move to hook
  const goto = (url: string, ev?: React.MouseEvent) => {
    if (ev) ev.stopPropagation()
    navigate(url)
  }

  return (
    <article className="post-preview main">
      <div className="options-wrapper">
        <div className="icon-wrap" onClick={() => setPostPopup(true)}>
          <OptionsIcon />
        </div>
        {postPopup ? (
          <PostOptionsPopup
            postId={post._id}
            composerId={post.userId}
            composerUsername={post.composerUsername}
            handleClose={() => setPostPopup(false)}
          />
        ) : null}
      </div>
      {msg ? (
        <section className="pipe-top-section">
          <div className="pipe pipe-top"></div>
          <div className="empty"></div>
        </section>
      ) : null}
      <section className="composer-details">
        <img src={post.composerImgUrl} alt="" className="user-img" />
        <span className="header">
          <span
            className="full-name link"
            onClick={(ev) => goto(`/profile/${post.userId}`, ev)}>
            {post.composerFullName}
          </span>
          <span className="username">@{post.composerUsername}</span>
        </span>
      </section>

      {msg ? (
        <p className="group-msg msg-bottom">
          Replying to <Mention username={msg.info.username as string} />
        </p>
      ) : null}

      <div className="post-content">
        <p className="post-text">{formatPost(post)}</p>
        {post.imgUrl ? (
          <img src={post.imgUrl} alt="" className="post-img" />
        ) : null}
      </div>
      <div className="time-bar">
        <p className="time-info">
          {new Date(post.createdAt as Date).toLocaleString('default', {
            // month: 'long',
            // year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        <span className="divider">·</span>
        <p className="date-info">
          {new Date(post.createdAt as Date).toLocaleString('default', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </p>
        {/* <span className="divider">·</span>
        <p className="view-info">
          <span className="bold">144</span> Views
        </p> */}
      </div>
      <div className="stats">
        <p className="likes-amount">
          <span className="bold">{Object.keys(post.likes).length}</span>{' '}
          {Object.keys(post.likes).length === 1 ? 'Like' : 'Likes'}
        </p>
      </div>
      <PostActions post={post} />
    </article>
  )
}

interface PostDetailsProps {}

export const PostDetails: React.FC<PostDetailsProps> = ({}) => {
  const params = useParams()
  const { postId } = params
  if (!postId) return <></>

  const { data: post, isLoading: isLoadingPost } = useGetPostQuery(postId)
  const { data: repliedToPost, isLoading: isLoadingReply } = useGetPostQuery(
    post?.repliedTo as string
  )
  const { data: replies } = useGetPostRepliesQuery(postId)

  const bottomMsgData = {
    type: 'reply',
    location: 'bottom',
    info: {
      username: repliedToPost?.composerUsername,
      fullName: repliedToPost?.composerFullName,
    },
  }

  const replyMsgData = {
    type: 'reply',
    location: 'inner',
    info: {
      username: post?.composerUsername,
      fullName: post?.composerFullName,
    },
  }

  if (isLoadingPost && isLoadingReply)
    return (
      <section className="post-details">
        <LoadingCircle />
      </section>
    )

  return (
    <section className="post-details">
      <section className="post-group main">
        {repliedToPost && post?.repliedTo ? (
          <PostPreviewItem post={repliedToPost} />
        ) : null}
        {post ? (
          post?.repliedTo ? (
            <MainPost post={post} msg={bottomMsgData} />
          ) : (
            <MainPost post={post} />
          )
        ) : null}
      </section>
      <TweetEdit className="reply-edit" replyingTo={post} />
      {replies ? (
        <section className="replies">
          {replies.map((reply) => (
            <PostPreviewItem key={reply._id} post={reply} msg={replyMsgData} />
          ))}
        </section>
      ) : (
        <LoadingCircle />
      )}
      {/* TODO: show as singulars */}
    </section>
  )
}
