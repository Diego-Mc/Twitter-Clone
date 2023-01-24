import React from 'react'

import { PostList } from '../components/PostList'
import { TweetEdit } from '../components/TweetEdit'

import { useGetPostsQuery } from '../features/api/api.slice'
import { LoadingCircle } from '../components/LoadingCircle'

interface HomeProps {}

export const Home: React.FC<HomeProps> = ({}) => {
  const { data: posts } = useGetPostsQuery()

  return (
    <main className="home-view">
      <TweetEdit />
      <section className="show-more">Show 35 Tweets</section>
      {posts ? <PostList posts={posts} /> : <LoadingCircle />}
    </main>
  )
}
