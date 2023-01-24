import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { PostList } from '../components/PostList'
import {
  PostPreview,
  PostPreviewItem,
  PostPreviewItemProps,
} from '../components/PostPreview'
import { ReactComponent as CommentFilledIcon } from '../assets/icons/comment_filled.svg'

import { TweetEdit } from '../components/TweetEdit'
import {
  useGetPostQuery,
  useGetPostRepliesQuery,
} from '../features/api/api.slice'
import { PostProps } from '../types/models'
import { Mention } from '../components/Mention'
import { postService } from '../services/post.service'
import { PostActions } from '../components/PostActions'
import { LoadingCircle } from '../components/LoadingCircle'

export const MainPost: React.FC<PostPreviewItemProps> = ({ post, msg }) => {
  return (
    <article className="post-preview main">
      {msg ? (
        <section className="pipe-top-section">
          <div className="pipe pipe-top"></div>
          <div className="empty"></div>
        </section>
      ) : null}
      <section className="composer-details">
        <img src={post.composerImgUrl} alt="" className="user-img" />
        <span className="header">
          <span className="full-name link">{post.composerFullName}</span>
          <span className="username">@{post.composerUsername}</span>
        </span>
      </section>

      {msg ? (
        <p className="group-msg msg-bottom">
          Replying to <Mention username={msg.info.username as string} />
        </p>
      ) : null}

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
      <div className="time-bar">
        <p className="time-info">8:44 PM</p>
        <span className="divider">·</span>
        <p className="date-info">Jan 19, 2023</p>
        <span className="divider">·</span>
        <p className="view-info">
          <span className="bold">144</span> Views
        </p>
      </div>
      <div className="stats">
        <p className="likes-amount">
          <span className="bold">5</span> Likes
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
  const { data: replies, isLoading: isLoadingReplies } =
    useGetPostRepliesQuery(postId)

  let bottomMsgData
  if (repliedToPost)
    bottomMsgData = {
      type: 'reply',
      location: 'bottom',
      info: {
        username: repliedToPost.composerUsername,
        fullName: repliedToPost.composerFullName,
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
          bottomMsgData && post?.repliedTo ? (
            <MainPost post={post} msg={bottomMsgData} />
          ) : (
            <MainPost post={post} />
          )
        ) : null}
      </section>
      <TweetEdit />
      {replies ? (
        replies.map((reply) => <PostPreviewItem key={reply._id} post={reply} />)
      ) : (
        <LoadingCircle />
      )}
      {/* TODO: show as singulars */}
    </section>
  )
}
