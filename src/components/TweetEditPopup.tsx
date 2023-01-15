import React from 'react'
import { TweetEdit } from './TweetEdit'

interface TweetEditPopupProps {}

export const TweetEditPopup: React.FC<TweetEditPopupProps> = ({}) => {
  return (
    <div className="popup">
      <TweetEdit />
    </div>
  )
}
