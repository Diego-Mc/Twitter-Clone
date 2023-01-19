import { TagProps, UserProps } from './../../types/models'
import { userService } from './../../services/user.service'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { PostProps } from '../../types/models'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3001/api' }),
  tagTypes: ['Posts', 'Tags', 'ToFollow'],
  endpoints: (builder) => ({
    getPosts: builder.query<PostProps[], void>({
      query: () => '/posts',
      transformResponse: (res: PostProps[]) =>
        res.sort((a, b) => b._id.localeCompare(a._id)),
      providesTags: ['Posts'],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Posts', 'Tags'],
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'PATCH',
        body: { userId: userService.getLoggedInUser()._id },
      }),
      invalidatesTags: ['Posts'],
    }),
    /* TRENDS/TAGS */
    getTrends: builder.query<TagProps[], void>({
      query: () => '/tags',
      providesTags: ['Tags'],
    }),
    /* USERS */
    getRandomUsersToFollow: builder.query<UserProps[], void>({
      query: () =>
        `/users/${userService.getLoggedInUser()._id}/random-to-follow`,
      providesTags: ['ToFollow'],
    }),
  }),
})

export const { useGetPostsQuery, useAddPostMutation, useLikePostMutation } =
  apiSlice

export const { useGetTrendsQuery } = apiSlice

export const { useGetRandomUsersToFollowQuery } = apiSlice
