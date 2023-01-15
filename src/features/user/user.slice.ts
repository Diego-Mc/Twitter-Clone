import { createSlice } from '@reduxjs/toolkit'
import { UserProps } from '../../types/models'

const initialState: UserProps = {
  fullName: '',
  email: '',
  username: '',
  description: '',
  followers: [],
  following: [],
  imgUrl: '',
  coverUrl: '',
  bookmarks: [],
}

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    initUser: (state, action) => {
      return action.payload
    },
  },
})

export const { initUser } = userSlice.actions

export default userSlice.reducer
