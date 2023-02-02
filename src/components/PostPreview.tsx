import React, { useState } from 'react'
import { ReactComponent as CommentFilledIcon } from '../assets/icons/comment_filled.svg'
import { ReactComponent as OptionsIcon } from '../assets/icons/options.svg'
import { ReactComponent as TrashIcon } from '../assets/icons/trash.svg'
import { ReactComponent as FollowIcon } from '../assets/icons/follow.svg'
import { ReactComponent as UnfollowIcon } from '../assets/icons/unfollow.svg'
import {
  useDeletePostMutation,
  useFollowUserMutation,
  useGetPostQuery,
  useGetUserQuery,
} from '../features/api/api.slice'
import { PostProps } from '../types/models'
import { useNavigate } from 'react-router-dom'
import { Mention } from './Mention'
import { PostActions } from './PostActions'
import { useFormatPost } from '../hooks/useFormatPost'
import TimeAgo from 'timeago-react'
import { userService } from '../services/user.service'
import { toast } from 'react-hot-toast'

//TODO: break up Item from regular?

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

  const [postPopup, setPostPopup] = useState(false)

  const goto = (url: string, ev?: React.MouseEvent): void => {
    if (onComposeClose) onComposeClose()
    if (ev) ev.stopPropagation()
    navigate(url)
  }

  const togglePostPopup = (
    force: boolean
  ): ((e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void) => {
    return (e) => {
      e?.stopPropagation()
      setPostPopup(force)
    }
  }

  const [formatPost] = useFormatPost()

  return (
    <>
      <article
        className="post-preview"
        onClick={() => goto(`/post/${post._id}`)}>
        <div className="options-wrapper">
          <div className="icon-wrap" onClick={togglePostPopup(true)}>
            <OptionsIcon />
          </div>
          {postPopup ? (
            <PostOptionsPopup
              postId={post._id}
              composerId={post.userId}
              composerUsername={post.composerUsername}
              handleClose={togglePostPopup(false)}
            />
          ) : null}
        </div>
        {msg ? (
          msg.location === 'top' ? (
            <div className="msg-top ">
              <CommentFilledIcon className="group-icon" />
              <p className="group-msg trunc">{msg.info.fullName} replied</p>
            </div>
          ) : msg.location === 'bottom' ? (
            <p className="group-msg msg-bottom trunc">
              Replying to&nbsp;
              <Mention
                username={msg.info.username as string}
                onNavigate={onComposeClose}
              />
            </p>
          ) : null
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
            <span className="time link">
              <TimeAgo datetime={post.createdAt as Date} locale="twitter" />
            </span>
          </span>
          {msg?.location === 'inner' ? (
            <p className="group-msg trunc msg-inner">
              Replying to&nbsp;
              <Mention
                username={msg.info.username as string}
                onNavigate={onComposeClose}
              />
            </p>
          ) : null}
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
  const { data: originalPost } = useGetPostQuery(post.repliedTo)
  const topMsgData = {
    type: 'reply',
    location: 'top',
    info: {
      username: post?.composerUsername,
      fullName: post?.composerFullName,
    },
  }
  const bottomMsgData = {
    type: 'reply',
    location: 'bottom',
    info: {
      username: originalPost?.composerUsername,
      fullName: originalPost?.composerFullName,
    },
  }
  return (
    <section className="post-group">
      {originalPost ? (
        <PostPreviewItem
          post={originalPost}
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

interface OptionsPopupProps {
  handleClose: (e?: React.MouseEvent<HTMLDivElement, MouseEvent>) => void
  composerId: string
  postId: string
  composerUsername: string
}

export const PostOptionsPopup: React.FC<OptionsPopupProps> = ({
  handleClose,
  postId,
  composerId,
  composerUsername,
}) => {
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)
  const [follow] = useFollowUserMutation()
  const [deletePost] = useDeletePostMutation()

  const handleDeletePost = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    const deletePrms = deletePost(postId).unwrap()
    toast.promise(deletePrms, {
      loading: 'Deleting post...',
      success: 'Post deleted successfully',
      error: 'Unable to delete post',
    })
    handleClose()
  }

  const handleFollowUser = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation()
    follow(composerId)
    handleClose()
  }

  const isFollowing = () => {
    return user?.followings.includes(composerId)
  }

  return (
    <>
      <div className="bg-close-popup" onClick={handleClose}></div>
      <section className="options-popup">
        {user?._id !== composerId ? (
          <article className="option" onClick={handleFollowUser}>
            {isFollowing() ? <UnfollowIcon /> : <FollowIcon />}
            {isFollowing() ? 'Unfollow' : 'Follow'} @{composerUsername}
          </article>
        ) : (
          <article className="option red" onClick={handleDeletePost}>
            <TrashIcon />
            Delete
          </article>
        )}
      </section>
    </>
  )
}
