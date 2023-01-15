import React from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { PostProps } from '../types/models'

interface PostPreviewProps {
  post: PostProps
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  return (
    <article className="post-preview">
      <img src={post.composerImgUrl} alt="" className="user-img" />
      <span className="header">
        <span className="full-name link">{post.composerFullName}</span>
        <span className="username">@{post.composerUsername}</span>
        <span className="divider">·</span>
        <span className="time link">6h</span>
      </span>
      <div className="post-content">
        <p className="post-text">{post.text}</p>
        {post.imgUrl ? (
          <img src={post.imgUrl} alt="" className="post-img" />
        ) : null}
      </div>
      <div className="options">
        <div className="icon comment">
          <div className="icon-wrap sm">
            <CommentIcon />
          </div>
          <span className="amount">{post.replies.length}</span>
        </div>
        <div className="icon like">
          <div className="icon-wrap sm">
            <HeartIcon />
          </div>
          <span className="amount">{post.likes.size || 0}</span>
        </div>
        <div className="icon share">
          <div className="icon-wrap sm">
            <ShareIcon />
          </div>
        </div>
      </div>
    </article>
  )
}
