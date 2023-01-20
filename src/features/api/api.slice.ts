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
    getPost: builder.query<PostProps, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getPostReplies: builder.query<PostProps[], string>({
      query: (postId) => `/posts/${postId}/replies`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: ['Posts', 'Tags'],
    }),
    addReply: builder.mutation({
      query: ({ post, replyingTo }) => ({
        url: `/posts/${replyingTo._id}`,
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
    getTrendPosts: builder.query<PostProps[], string>({
      query: (tagName) => `/tags/${tagName}`,
      // providesTags: ['Posts'],
    }),
    /* USERS */
    getRandomUsersToFollow: builder.query<UserProps[], void>({
      query: () =>
        `/users/${userService.getLoggedInUser()._id}/random-to-follow`,
      providesTags: ['ToFollow'],
    }),
    followUser: builder.mutation({
      query: (userToFollowId) => ({
        url: `/users/${userService.getLoggedInUser()._id}/${userToFollowId}`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ToFollow'],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostRepliesQuery,
  useAddPostMutation,
  useAddReplyMutation,
  useLikePostMutation,
} = apiSlice

export const { useGetTrendsQuery, useGetTrendPostsQuery } = apiSlice

export const { useGetRandomUsersToFollowQuery, useFollowUserMutation } =
  apiSlice
