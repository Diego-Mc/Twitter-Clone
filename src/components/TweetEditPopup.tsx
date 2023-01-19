import React, { useEffect, useRef } from 'react'
import { TweetEditBase } from './TweetEditBase'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'
import { PostProps } from '../types/models'
import { PostPreview, PostPreviewItem } from './PostPreview'

interface PostToReplyProps {
  post: PostProps
}

export const PostToReply: React.FC<PostToReplyProps> = ({ post }) => {
  return (
    <>
      <PostPreviewItem post={post} />
      <article className="replying-info">
        Replying to{' '}
        <a className="mention" href="testing!">
          @{post.composerUsername}
        </a>
      </article>
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
        className={`tweet-edit ${replyingTo ? 'reply' : ''}`}
        onClick={(e) => e.stopPropagation()}>
        <div className="close-section">
          <div className="icon-wrap" onClick={(e) => onComposeClose()}>
            <CloseIcon />
          </div>
        </div>
        {replyingTo ? <PostToReply post={replyingTo} /> : null}
        <TweetEditBase
          setFocusRef={setFocusRef}
          onComposeClose={onComposeClose}
          replyingTo={replyingTo}
        />
      </section>
    </div>
  )
}
