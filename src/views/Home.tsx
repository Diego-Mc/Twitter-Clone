import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PostList } from '../components/PostList'
import { TweetEdit } from '../components/TweetEdit'
import { RootState } from '../features/store'
import { initUser } from '../features/user/user.slice'
import { postService } from '../services/post.service.js'
import { userService } from '../services/user.service'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    let isCanceled = false
    ;(async () => {
      try {
        //get from sessionStorage
        //TODO: change to getLoggedInUser (logic to check session storage vs cookie)
        const user = await userService.getById('63bc3ad1251c857fc6b1c6fd')
        if (!isCanceled) dispatch(initUser(user))
      } catch (err) {
        navigate('/login')
      }
    })()

    return () => {
      isCanceled = true
    }
  }, [])

  const [posts, setPosts] = useState(null)

  useEffect(() => {
    let isCanceled = false
    ;(async () => {
      const posts = await postService.getFeedPosts()
      if (!isCanceled) setPosts(posts)
    })()
    return () => {
      isCanceled = true
    }
  }, [])

  return (
    <main className="home-view">
      <TweetEdit />
      <section className="show-more">Show 35 Tweets</section>
      {posts ? <PostList posts={posts} /> : <div>Loading posts...</div>}
    </main>
  )
}
