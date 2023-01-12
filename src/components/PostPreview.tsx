import React from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'

interface PostPreviewProps {}

export const PostPreview: React.FC<PostPreviewProps> = ({}) => {
  return (
    <article className="post-preview">
      <img src="default-user-img.png" alt="" className="user-img" />
      <span className="header">
        <span className="full-name link">Browyn Williams</span>
        <span className="username">@brownynwilliams</span>
        <span className="divider">·</span>
        <span className="time link">6h</span>
      </span>
      <div className="post-content">
        <p className="post-text">
          I am so, so much more productive when I work from inside bed than
          outside it.
        </p>
        <img src="#" alt="" className="post-img" />
      </div>
      <div className="options">
        <div className="icon comment">
          <div className="icon-wrap sm">
            <CommentIcon />
          </div>
          <span className="amount">1</span>
        </div>
        <div className="icon like">
          <div className="icon-wrap sm">
            <HeartIcon />
          </div>
          <span className="amount">28</span>
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
