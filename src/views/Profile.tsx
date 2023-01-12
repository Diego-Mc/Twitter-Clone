import React from 'react'
import { PostList } from '../components/PostList'
import { WhoToFollow } from '../components/WhoToFollow'
import { ReactComponent as CalendarIcon } from '../assets/icons/calendar.svg'

interface ProfileProps {}

export const Profile: React.FC<ProfileProps> = ({}) => {
  return (
    <section className="profile-view">
      <section className="profile-header">
        <section className="cover">
          <img src="cover-example.jpeg" alt="cover" />
          {/* <div className="placeholder">
          Conditionally put this instead of img if none exist
        </div> */}
        </section>

        <section className="details">
          <section className="header">
            <img src="default-user-img.png" alt="" className="user-img" />
            <button className="pill white setup-btn">Set up profile</button>
          </section>

          <section className="info">
            <h3 className="full-name">Diego Mc</h3>
            <p className="username">@DiegoMc99</p>
            <p className="date-info">
              <CalendarIcon className="icon" />
              Joined October 2022
            </p>
            <span className="metadata">
              <small>
                <span className="bold">32</span>
                Following
              </small>
              <small>
                <span className="bold">1</span>
                Followers
              </small>
            </span>
          </section>
        </section>
      </section>

      <section className="profile-tabs">
        <input type="radio" name="profile-tab" id="tweets" />
        <label className="tab" htmlFor="tweets">
          <span className="text">Tweets</span>
        </label>
        <input type="radio" name="profile-tab" id="tweets-and-replies" />
        <label className="tab" htmlFor="tweets-and-replies">
          <span className="text">Tweets & replies</span>
        </label>
        <input type="radio" name="profile-tab" id="media" />
        <label className="tab" htmlFor="media">
          <span className="text">Media</span>
        </label>
        <input type="radio" name="profile-tab" id="likes" />
        <label className="tab" htmlFor="likes">
          <span className="text">Likes</span>
        </label>
      </section>

      <section className="open-tab">
        <WhoToFollow />
        {/* Add to whotofollow option to show description & change title if needed */}
        <PostList />
      </section>
    </section>
  )
}
