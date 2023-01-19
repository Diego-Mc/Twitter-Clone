import React from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { useLikePostMutation } from '../features/api/api.slice'
import { PostProps } from '../types/models'
import { utilService } from '../services/util.service'

interface PostPreviewProps {
  post: PostProps
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  const [likePost] = useLikePostMutation()

  const handleLike = () => {
    likePost(post._id)
  }

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
    <article className="post-preview">
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
          dangerouslySetInnerHTML={{ __html: generatePostHtml() }}></p>
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
        <div className="icon like" onClick={handleLike}>
          <div className="icon-wrap sm">
            <HeartIcon />
          </div>
          <span className="amount">{Object.keys(post.likes).length}</span>
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
