import { ReactComponent as ImgIcon } from '../assets/icons/img.svg'
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg'
import { ReactComponent as PollIcon } from '../assets/icons/poll.svg'
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg'
import { ReactComponent as DateIcon } from '../assets/icons/date.svg'
import { ReactComponent as LocationIcon } from '../assets/icons/location.svg'
import { useEffect, useRef } from 'react'
import { TweetEditBase } from './TweetEditBase'
import { PostProps } from '../types/models'

interface TweetEditProps {
  setFocusRef?: (el: HTMLDivElement) => void
  onComposeClose?: () => void
  replyingTo?: PostProps
  className?: string
}

export const TweetEdit: React.FC<TweetEditProps> = ({
  className,
  ...props
}) => {
  return (
    <section className={`tweet-edit ${className}`}>
      <TweetEditBase {...props} />
    </section>
  )
}
