import { configureStore } from '@reduxjs/toolkit'
import { apiSlice } from './api/api.slice'
import { setupListeners } from '@reduxjs/toolkit/dist/query'
import { useDispatch } from 'react-redux'

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
})

setupListeners(store.dispatch)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
