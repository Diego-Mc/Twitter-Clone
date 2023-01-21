import { createSearchParams } from 'react-router-dom'
import { TagProps, UserProps } from './../../types/models'
import { userService } from './../../services/user.service'
import {
  createApi,
  fetchBaseQuery,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from '@reduxjs/toolkit/query/react'
import { PostProps } from '../../types/models'
import { QueryReturnValue } from '@reduxjs/toolkit/dist/query/baseQueryTypes'

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: 'http://localhost:3001/api',
    credentials: 'include',
  }),
  tagTypes: ['Posts', 'Tags', 'ToFollow', 'Users', 'LoggedInUser'],
  endpoints: (builder) => ({
    getPosts: builder.query<any, string | void>({
      queryFn: async (query = undefined, queryApi, extraOptions, baseQuery) => {
        let path = '/posts'
        if (query) path += `?${createSearchParams(query)}`
        const result = (await baseQuery(path)) as QueryReturnValue<
          PostProps[],
          FetchBaseQueryError,
          FetchBaseQueryMeta
        >
        const data = result.data
        data?.sort((a: PostProps, b: PostProps) => b._id.localeCompare(a._id))
        return { data }
      },
    }),
    getPost: builder.query<PostProps, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getPostReplies: builder.query<PostProps[], string>({
      query: (postId) => `/posts/${postId}/replies`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getUserPosts: builder.query<PostProps[], string>({
      query: (userId) => `/posts/profile/${userId}`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getUserPostsAndReplies: builder.query<PostProps[], string>({
      query: (userId) => `/posts/profile/all/${userId}`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getUserMediaPosts: builder.query<PostProps[], string>({
      query: (userId) => `/posts/profile/media/${userId}`,
      providesTags: ['Posts'], //TODO: invalidate specific item
    }),
    getUserLikedPosts: builder.query<PostProps[], string>({
      query: (userId) => `/posts/profile/likes/${userId}`,
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
      }),
      invalidatesTags: ['Posts'],
    }),
    bookmarkPost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/bookmark`,
        method: 'PATCH',
      }),
      invalidatesTags: ['LoggedInUser'],
    }),
    getBookmarksFromUser: builder.query<any, UserProps>({
      // query: (userId) => `/posts/profile/bookmarks/${userId}`,
      // providesTags: ['Posts'], //TODO: invalidate specific item
      queryFn: async (user, queryApi, extraOptions, baseQuery) => {
        if (!user) return { data: null }

        const bookmarks = await Promise.all(
          user.bookmarks.map((bookmark) => baseQuery(`posts/${bookmark}`))
        )
        const merged = [...bookmarks?.map((result: any) => result.data)]
        return { data: merged }
      },
    }),
    /* TRENDS/TAGS */
    getTrends: builder.query<TagProps[], void>({
      query: () => '/tags',
      providesTags: ['Tags'],
    }),
    getTrendPosts: builder.query<any, any>({
      queryFn: async (trends, queryApi, extraOptions, baseQuery) => {
        if (!trends) return { data: null }

        const trendPosts = await Promise.all(
          trends.map((tag: TagProps) => baseQuery(`tags/${tag.tagName}`))
        )
        const merged = [...trendPosts?.map((result: any) => result.data)]
        return { data: merged }
      },
    }),

    /* USERS */
    getLoggedInUser: builder.query<UserProps, void>({
      query: () => `/users/logged-in`,
      providesTags: ['LoggedInUser'],
    }),
    getUser: builder.query<UserProps, void>({
      query: (userId) => `/users/${userId}`,
      providesTags: ['Users'],
    }),
    getRandomUsersToFollow: builder.query<UserProps[], void>({
      query: () => `/users/random-to-follow`,
      providesTags: ['ToFollow'],
    }),
    followUser: builder.mutation({
      query: (userToFollowId) => ({
        url: `/users/${userToFollowId}/follow`,
        method: 'PATCH',
      }),
      invalidatesTags: ['ToFollow'],
    }),

    /* AUTH */
    register: builder.mutation({
      query: (userCred) => ({
        url: `/auth/register`,
        method: 'POST',
        body: userCred,
      }),
      invalidatesTags: ['LoggedInUser'],
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
      }),
      invalidatesTags: ['LoggedInUser'],
    }),
  }),
})

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useGetPostRepliesQuery,
  useGetUserPostsQuery,
  useGetUserPostsAndRepliesQuery,
  useGetUserMediaPostsQuery,
  useGetUserLikedPostsQuery,
  useAddPostMutation,
  useAddReplyMutation,
  useLikePostMutation,
  useBookmarkPostMutation,
  useGetBookmarksFromUserQuery,
} = apiSlice

export const { useGetTrendsQuery, useGetTrendPostsQuery } = apiSlice

export const {
  useGetLoggedInUserQuery,
  useGetRandomUsersToFollowQuery,
  useFollowUserMutation,
} = apiSlice

export const { useRegisterMutation, useLogoutMutation } = apiSlice
