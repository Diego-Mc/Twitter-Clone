import { ReactComponent as ImgIcon } from '../assets/icons/img.svg'
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg'
import { ReactComponent as PollIcon } from '../assets/icons/poll.svg'
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg'
import { ReactComponent as DateIcon } from '../assets/icons/date.svg'
import { ReactComponent as LocationIcon } from '../assets/icons/location.svg'
import React, { useRef, useState } from 'react'
import { postService } from '../services/post.service'
import { userService } from '../services/user.service'
import {
  useAddPostMutation,
  useAddReplyMutation,
  useGetUserQuery,
} from '../features/api/api.slice'
import { PostProps } from '../types/models'
import { uploadImg } from '../services/upload.service'
import GifPicker, { TenorImage } from 'gif-picker-react'
import { toast } from 'react-hot-toast'

interface TweetEditBaseProps {
  setFocusRef?: (el: HTMLDivElement) => void
  onComposeClose?: () => void
  replyingTo?: PostProps
}

export const TweetEditBase: React.FC<TweetEditBaseProps> = ({
  setFocusRef,
  onComposeClose,
  replyingTo,
}) => {
  const contentTextRef = useRef<HTMLDivElement | null>(null)
  const imgUploadRef = useRef<HTMLInputElement | null>(null)
  const [imgUrl, setImgUrl] = useState<null | string>(null)
  const [gifPopup, setGifPopup] = useState(false)
  const { data: user } = useGetUserQuery(userService.getLoggedInUser()?._id)

  const [addPost] = useAddPostMutation()
  const [addReply] = useAddReplyMutation()

  const setContentRefs = (el: HTMLDivElement) => {
    if (setFocusRef) setFocusRef(el)
    contentTextRef.current = el
  }

  const handleTweetPost = async () => {
    if (!contentTextRef.current) return
    const tweetText = contentTextRef.current.innerText
    if (!tweetText || !user) return

    const post = postService.getEmptyPost()
    post.text = tweetText
    if (imgUrl) post.imgUrl = imgUrl
    post.composerId = user._id as string

    contentTextRef.current.innerText = ''
    if (onComposeClose) onComposeClose()

    let toastId: string

    if (replyingTo) {
      const addReplyPrms = addReply({ post, replyingTo }).unwrap()
      toastId = toast.loading('Uploading...')
      await addReplyPrms
    } else {
      const addReplyPrms = addPost({ post }).unwrap()
      toastId = toast.loading('Uploading...')
      await addReplyPrms
    }

    toast.dismiss(toastId)
  }

  const handleUpload = async (ev: any) => {
    //TODO: check size and type
    const imgUrl = await uploadImg(ev.target.files[0])
    setImgUrl(imgUrl.url)
  }

  const handleDragEnter = (ev: any) => {
    ev.preventDefault()
    contentTextRef.current?.classList.add('dragover')
  }

  const handleDragLeave = (ev: any) => {
    ev.preventDefault()
    contentTextRef.current?.classList.remove('dragover')
  }

  const handleDrop = async (ev: any) => {
    ev.preventDefault()
    contentTextRef.current?.classList.remove('dragover')
    console.log(JSON.stringify(ev.dataTransfer.files[0].name))
    //TODO: check size and type
    const imgUrl = await uploadImg(ev.dataTransfer.files[0])
    setImgUrl(imgUrl.url)
  }

  const handleGifIconClick = () => {
    setGifPopup(true)
  }

  const closeGifPopup = (ev: React.MouseEvent) => {
    ev.stopPropagation()
    setGifPopup(false)
  }

  const handleGifSelect = (gifObj: TenorImage) => {
    setImgUrl(gifObj.url)
    setGifPopup(false)
  }

  return (
    <>
      <img src={user?.imgUrl || '/default-user-img.png'} className="user-img" />
      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="content"
        contentEditable={true}
        ref={setContentRefs}></div>
      <div className="options">
        <div className="icons">
          <div
            className="icon-wrap blue"
            onClick={() => imgUploadRef?.current?.click()}>
            <form
              style={{
                position: 'fixed',
                pointerEvents: 'none',
                opacity: 0,
              }}>
              <input
                onChange={handleUpload}
                type="file"
                ref={imgUploadRef}
                style={{
                  position: 'fixed',
                  pointerEvents: 'none',
                  opacity: 0,
                }}
              />
            </form>
            <ImgIcon />
          </div>
          <div className="icon-wrap blue" onClick={handleGifIconClick}>
            <GifIcon />
            {gifPopup ? (
              <>
                <div
                  className="gif-picker-wrapper"
                  onClick={closeGifPopup}></div>
                <div
                  className="wrapper-stop-propagation"
                  onClick={(e) => e.stopPropagation()}>
                  <GifPicker
                    onGifClick={handleGifSelect}
                    tenorApiKey={import.meta.env.VITE_GIF_KEY}
                  />
                </div>
              </>
            ) : null}
          </div>

          <div className="icon-wrap blue disabled" title="[WIP]">
            <PollIcon />
          </div>
          <div className="icon-wrap blue disabled" title="[WIP]">
            <EmojiIcon />
          </div>
          <div className="icon-wrap blue disabled" title="[WIP]">
            <DateIcon />
          </div>
          <div className="icon-wrap blue disabled" title="[WIP]">
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
