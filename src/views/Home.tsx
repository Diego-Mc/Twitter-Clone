import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { PostList } from '../components/PostList'
import { TweetEdit } from '../components/TweetEdit'
import { RootState } from '../features/store'
import { initUser } from '../features/user/user.slice'
import { postService } from '../services/post.service.js'
import { userService } from '../services/user.service'

import { useGetPostsQuery } from '../features/api/api.slice'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  // userService.register({
  //   email: 'dd15@gmail.com',
  //   fullName: 'Diego Confdfgdftreras',
  //   username: 'diego_orfdgdiginal',
  //   password: '123456',
  // })

  // useEffect(() => {
  //   let isCanceled = false
  //   ;(async () => {
  //     try {
  //       //get from sessionStorage
  //       //TODO: change to getLoggedInUser (logic to check session storage vs cookie)
  //       const user = await userService.getById(
  //         userService.getLoggedInUser()._id
  //       )
  //       if (!isCanceled) dispatch(initUser(user))
  //     } catch (err) {
  //       navigate('/login')
  //     }
  //   })()

  //   return () => {
  //     isCanceled = true
  //   }
  // }, [])

  // const [posts, setPosts] = useState(null)

  // useEffect(() => {
  //   let isCanceled = false
  //   ;(async () => {
  //     const posts = await postService.getFeedPosts()
  //     if (!isCanceled) setPosts(posts)
  //   })()
  //   return () => {
  //     isCanceled = true
  //   }
  // }, [])

  const {
    data: posts,
    isLoading,
    isSuccess,
    isError,
    error,
  } = useGetPostsQuery()

  return (
    <main className="home-view">
      <TweetEdit />
      <section className="show-more">Show 35 Tweets</section>
      {posts ? <PostList posts={posts} /> : <div>Loading posts...</div>}
    </main>
  )
}
