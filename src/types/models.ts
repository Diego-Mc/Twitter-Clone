export type UserProps = {
  _id?: string
  password?: string
  username: string
  email: string
  fullName: string
  description: string
  imgUrl: string
  coverUrl: string
  followers: string[]
  following: string[]
  bookmarks: string[]
}

export type TagProps = {
  _id: string
  tagName: string
  posts: Map<string, boolean>
}

export type PostProps = {
  _id: string
  userId: string
  repliedTo?: string
  composerUsername: string
  composerFullName: string
  composerImgUrl: string
  text: string
  imgUrl: string
  likes: {
    [key: string]: boolean
  }
  replies: string[]
}
