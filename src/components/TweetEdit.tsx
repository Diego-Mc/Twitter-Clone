import { ReactComponent as ImgIcon } from '../assets/icons/img.svg'
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg'
import { ReactComponent as PollIcon } from '../assets/icons/poll.svg'
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg'
import { ReactComponent as DateIcon } from '../assets/icons/date.svg'
import { ReactComponent as LocationIcon } from '../assets/icons/location.svg'

interface TweetEditProps {}

export const TweetEdit: React.FC<TweetEditProps> = ({}) => {
  return (
    <section className="tweet-edit">
      <img src="default-user-img.png" alt="" className="user-img" />
      <div className="content">What's happening?</div>
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
        <button className="tweet-btn primary pill">Tweet</button>
      </div>
    </section>
  )
}
