import React from 'react'
import { PostList } from '../components/PostList'
import { ReactComponent as ImgIcon } from '../assets/icons/img.svg'
import { ReactComponent as GifIcon } from '../assets/icons/gif.svg'
import { ReactComponent as PollIcon } from '../assets/icons/poll.svg'
import { ReactComponent as EmojiIcon } from '../assets/icons/emoji.svg'
import { ReactComponent as DateIcon } from '../assets/icons/date.svg'
import { ReactComponent as LocationIcon } from '../assets/icons/location.svg'

interface TweetEditProps {}

const TweetEdit: React.FC<TweetEditProps> = ({}) => {
  return (
    <section className="tweet-edit">
      <img src="default-user-img.png" alt="" className="user-img" />
      <div className="content">What's happening?</div>
      <div className="options">
        <div className="icons">
          <ImgIcon />
          <GifIcon />
          <PollIcon />
          <EmojiIcon />
          <DateIcon />
          <LocationIcon />
        </div>
        <button className="tweet-btn primary pill">Tweet</button>
      </div>
    </section>
  )
}

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  return (
    <main className="home-view">
      <TweetEdit />
      <PostList />
    </main>
  )
}
