import React, { useState } from 'react'
import { ReactComponent as CommentIcon } from '../assets/icons/comment.svg'
import { ReactComponent as HeartIcon } from '../assets/icons/heart.svg'
import { ReactComponent as ShareIcon } from '../assets/icons/share.svg'
import { ReactComponent as CommentFilledIcon } from '../assets/icons/comment_filled.svg'
import { useGetPostQuery, useLikePostMutation } from '../features/api/api.slice'
import { PostProps } from '../types/models'
import { utilService } from '../services/util.service'
import { TweetEditPopup } from './TweetEditPopup'

interface PostPreviewItemProps {
  post: PostProps
  msg?: {
    type: string
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
  const [isCommenting, setIsCommenting] = useState(false)
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
    <>
      {isCommenting ? (
        <TweetEditPopup
          replyingTo={post}
          onComposeClose={() => setIsCommenting(false)}
        />
      ) : null}
      <article className={`post-preview ${msg ? 'with-msg' : null}`}>
        {msg ? (
          <>
            <CommentFilledIcon className="group-icon" />
            <p className="group-msg">{post.composerFullName} replied</p>
          </>
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
            dangerouslySetInnerHTML={{ __html: generatePostHtml() }}></p>
          {post.imgUrl ? (
            <img src={post.imgUrl} alt="" className="post-img" />
          ) : null}
        </div>
        <div className="options">
          <div className="icon comment" onClick={() => setIsCommenting(true)}>
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
    </>
  )
}

interface PostPreviewProps {
  post: PostProps
}

export const PostPreview: React.FC<PostPreviewProps> = ({ post }) => {
  if (!post.repliedTo) return <PostPreviewItem post={post} />

  const { data: repliedToPost } = useGetPostQuery(post.repliedTo)
  const replyMsgData = {
    type: 'reply',
    info: {
      username: repliedToPost?.composerUsername,
      fullName: repliedToPost?.composerFullName,
    },
  }
  return (
    <section className="post-group">
      {repliedToPost ? (
        <PostPreviewItem post={repliedToPost} msg={replyMsgData} />
      ) : null}
      <PostPreviewItem post={post} />
    </section>
  )
}
