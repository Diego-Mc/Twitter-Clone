import React, { useEffect, useRef } from 'react'
import { TweetEditBase } from './TweetEditBase'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { PostProps } from '../types/models'
import { PostPreview, PostPreviewItem } from './PostPreview'
import { Mention } from './Mention'

interface PostToReplyProps {
  post: PostProps
}

export const PostToReply: React.FC<PostToReplyProps> = ({ post }) => {
  return (
    <>
      <PostPreviewItem post={post} />
      <PostPreviewItem
        post={post}
        msg={{
          info: {
            username: post.composerUsername,
            fullName: post.composerFullName,
          },
          location: 'bottom',
          type: 'reply',
        }}
      />
    </>
  )
}

interface TweetEditPopupProps {
  onComposeClose: () => void
  replyingTo?: PostProps
}

export const TweetEditPopup: React.FC<TweetEditPopupProps> = ({
  onComposeClose,
  replyingTo,
}) => {
  const contentFocusRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    contentFocusRef.current?.focus()
  }, [])

  const setFocusRef = (el: HTMLDivElement) => {
    contentFocusRef.current = el
  }

  return (
    <div className="popup" onClick={(e) => onComposeClose()}>
      <section
        className={`tweet-edit  ${replyingTo ? 'reply' : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="close-section">
          <div className="icon-wrap" onClick={(e) => onComposeClose()}>
            <CloseIcon />
          </div>
        </div>
        <section className="post-group">
          {replyingTo ? <PostToReply post={replyingTo} /> : null}
        </section>
        <TweetEditBase
          setFocusRef={setFocusRef}
          onComposeClose={onComposeClose}
          replyingTo={replyingTo}
        />
      </section>
    </div>
  )
}
