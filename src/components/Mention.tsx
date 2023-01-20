import React from 'react'

interface MentionProps {
  username: string
}

export const Mention: React.FC<MentionProps> = ({ username }) => {
  return (
    <a className="mention" href="testing!">
      @{username}
    </a>
  )
}
