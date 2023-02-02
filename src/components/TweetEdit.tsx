import { TweetEditBase } from './TweetEditBase'
import { PostProps } from '../types/models'

interface TweetEditProps {
  setFocusRef?: (el: HTMLDivElement) => void
  onComposeClose?: () => void
  replyingTo?: PostProps
  className?: string
}

//TODO: what's the point of this?

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
