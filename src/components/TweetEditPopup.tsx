import React, { useEffect, useRef } from 'react'
import { TweetEditBase } from './TweetEditBase'
import { ReactComponent as CloseIcon } from '../assets/icons/close.svg'

interface TweetEditPopupProps {
  onComposeClose: () => void
}

export const TweetEditPopup: React.FC<TweetEditPopupProps> = ({
  onComposeClose,
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
      <section className="tweet-edit" onClick={(e) => e.stopPropagation()}>
        <div className="close-section">
          <div className="icon-wrap" onClick={(e) => onComposeClose()}>
            <CloseIcon />
          </div>
        </div>
        <TweetEditBase setFocusRef={setFocusRef} />
      </section>
    </div>
  )
}
