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

export const MainPost: React.FC<PostPreviewItemProps> = ({ post, msg }) => {
  return (
    <article
      className={`post-preview main ${
        msg ? `with-msg ${msg.location}` : null
      }`}>
      {msg ? (
        msg.location === 'top' ? (
          <>
            <CommentFilledIcon className="group-icon" />
            <p className="group-msg">{msg.info?.fullName} replied</p>
          </>
        ) : (
          <p className="group-msg">
            Replying to <Mention username={msg.info?.username as string} />
          </p>
        )
      ) : null}
      <img src={post.composerImgUrl} alt="" className="user-img" />
      <span className="header">
        <span className="full-name link">{post.composerFullName}</span>
        <span className="username">@{post.composerUsername}</span>
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

  const { data: post } = useGetPostQuery(postId)
  const { data: repliedToPost } = useGetPostQuery(post?.repliedTo as string)
  const { data: replies } = useGetPostRepliesQuery(postId)

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

  return (
    <section className="post-details">
      <section className="post-group main">
        {repliedToPost ? <PostPreviewItem post={repliedToPost} /> : null}
        {post ? (
          bottomMsgData ? (
            <MainPost post={post} msg={bottomMsgData} />
          ) : (
            <MainPost post={post} />
          )
        ) : null}
      </section>
      <TweetEdit />
      {replies ? <PostList posts={replies} /> : null}{' '}
      {/* TODO: show as singulars */}
    </section>
  )
}
