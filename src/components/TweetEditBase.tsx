import { ReactComponent as ImgIcon } from '../assets/icons/img.svg'
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg'
import { ReactComponent as PollIcon } from '../assets/icons/poll.svg'
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg'
import { ReactComponent as DateIcon } from '../assets/icons/date.svg'
import { ReactComponent as LocationIcon } from '../assets/icons/location.svg'
import { useEffect, useRef, useState } from 'react'
import { postService } from '../services/post.service'
import { userService } from '../services/user.service'
import { useAddPostMutation } from '../features/api/api.slice'

interface TweetEditBaseProps {
  setFocusRef?: (el: HTMLDivElement) => void
}

export const TweetEditBase: React.FC<TweetEditBaseProps> = ({
  setFocusRef,
}) => {
  const contentTextRef = useRef<HTMLDivElement | null>(null)

  const [addPost] = useAddPostMutation()

  const setContentRefs = (el: HTMLDivElement) => {
    if (setFocusRef) setFocusRef(el)
    contentTextRef.current = el
  }

  const handleTweetPost = () => {
    if (!contentTextRef.current) return
    const tweetText = contentTextRef.current.innerText
    if (!tweetText) return
    const post = postService.getEmptyPost()
    post.text = tweetText
    post.composerId = userService.getLoggedInUser()._id
    addPost({ ...post })
    contentTextRef.current.innerText = ''
  }

  return (
    <>
      <img src="default-user-img.png" alt="" className="user-img" />
      <div
        className="content"
        contentEditable={true}
        ref={setContentRefs}></div>
      <div className="options">
        <div className="icons">
          <div className="icon-wrap blue">
            <ImgIcon />
          </div>
          <div className="icon-wrap blue">
            <GifIcon />
          </div>
          <div className="icon-wrap blue">
            <PollIcon />
          </div>
          <div className="icon-wrap blue">
            <EmojiIcon />
          </div>
          <div className="icon-wrap blue">
            <DateIcon />
          </div>
          <div className="icon-wrap blue">
            <LocationIcon />
          </div>
        </div>
        <button className="tweet-btn primary pill" onClick={handleTweetPost}>
          Tweet
        </button>
      </div>
    </>
  )
}
