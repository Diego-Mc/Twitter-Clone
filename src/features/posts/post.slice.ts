import { createSlice } from '@reduxjs/toolkit'
import { PostProps } from '../../types/models'

interface PostState {
  posts: Array<PostProps>
  filterBy: {
    index: number
    limit: number
    search: string
  }
}

const initialState: PostState = {
  posts: [],
  filterBy: {
    index: 0,
    limit: 20,
    search: '',
  },
}

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    initPosts: (state, action) => {
      return action.payload
    },
  },
})

export const { initPosts } = postSlice.actions

export default postSlice.reducer
