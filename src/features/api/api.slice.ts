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
    baseUrl:
      process.env.NODE_ENV === 'production'
        ? '/api'
        : 'http://localhost:3001/api',
    credentials: 'include',
  }),
  tagTypes: ['Posts', 'Tags', 'ToFollow', 'Users', 'LoggedInUser'],
  endpoints: (builder) => ({
    getPosts: builder.query<any, { [key: string]: string } | void>({
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
      providesTags: (res) =>
        res
          ? [res.map(({ _id }: any) => ({ type: 'Posts', _id })), 'Posts']
          : ['Posts'],
    }),
    getPost: builder.query<PostProps, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (res, err, arg) => [{ type: 'Posts', _id: arg }],
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
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPost } = await queryFulfilled
          const patchResult = dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
              posts.unshift(updatedPost)
            })
          )
        } catch (err) {
          console.log('error adding post', err)
        }
      },
    }),
    addReply: builder.mutation({
      query: ({ post, replyingTo }) => ({
        url: `/posts/${replyingTo._id}`,
        method: 'POST',
        body: post,
      }),
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedReply } = await queryFulfilled
          const patchResult = dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
              posts.unshift(updatedReply)
            })
          )
        } catch (err) {
          console.log('error adding reply', err)
        }
      },
    }),
    likePost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/like`,
        method: 'PATCH',
      }),
      // invalidatesTags: (res, error, arg) => [{ type: 'Posts', _id: arg }],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getPosts',
            undefined,
            (posts: PostProps[]) => {
              const userId = userService.getLoggedInUser()._id
              const filteredPosts = posts.filter((post) => post._id === args)
              if (filteredPosts.length === 0) return
              const isLiked = filteredPosts[0].likes[userId]
              filteredPosts.forEach((post) => (post.likes[userId] = !isLiked))
            }
          )
        )
        dispatch(
          apiSlice.util.updateQueryData('getPost', args, (post) => {
            const userId = userService.getLoggedInUser()._id
            post.likes[userId] = !post.likes[userId]
          })
        )
        try {
          const { data: updatedReply } = await queryFulfilled
        } catch (err) {
          console.log('error adding reply', err)
        }
      },
    }),
    bookmarkPost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/bookmark`,
        method: 'PATCH',
      }),
      // invalidatesTags: ['LoggedInUser'],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        const patchResult = dispatch(
          apiSlice.util.updateQueryData(
            'getLoggedInUser',
            undefined,
            (user: UserProps) => {
              const bookmarkIdx = user.bookmarks.indexOf(args)
              if (bookmarkIdx < 0) user.bookmarks.push(args)
              else user.bookmarks.splice(bookmarkIdx, 1)
            }
          )
        )
        try {
          const { data: updatedReply } = await queryFulfilled
        } catch (err) {
          console.log('error adding reply', err)
        }
      },
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
    uploadProfilePic: builder.mutation({
      query: (url) => ({
        url: `/users/upload/profile-img`,
        method: 'PATCH',
        body: { imgUrl: url },
      }),
      invalidatesTags: ['LoggedInUser'],
    }),
    uploadCoverPic: builder.mutation({
      query: (url) => ({
        url: `/users/upload/cover-img`,
        method: 'PATCH',
        body: { imgUrl: url },
      }),
      invalidatesTags: ['LoggedInUser'],
    }),
    updateDescription: builder.mutation({
      query: (description) => ({
        url: `/users/update/description`,
        method: 'PATCH',
        body: { description },
      }),
      invalidatesTags: ['LoggedInUser'],
    }),

    /* AUTH */
    register: builder.mutation({
      query: (userCred) => ({
        url: `/auth/register`,
        method: 'POST',
        body: userCred,
      }),
      transformResponse: (res: { token: string; user: { _id: string } }) => {
        sessionStorage.setItem('loggedInUser', JSON.stringify(res.user))
        return res
      },
      invalidatesTags: ['LoggedInUser'],
    }),
    login: builder.mutation({
      query: (userCred) => ({
        url: `/auth/login`,
        method: 'POST',
        body: userCred,
      }),
      transformResponse: (res: { token: string; user: { _id: string } }) => {
        sessionStorage.setItem('loggedInUser', JSON.stringify(res.user))
        return res
      },
      invalidatesTags: ['LoggedInUser'],
    }),
    logout: builder.mutation<string, void>({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
      }),
      transformResponse: (res: { msg: string }) => {
        sessionStorage.removeItem('loggedInUser')
        return res.msg
      },
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
  useGetUserQuery,
  useGetRandomUsersToFollowQuery,
  useFollowUserMutation,
  useUploadProfilePicMutation,
  useUploadCoverPicMutation,
  useUpdateDescriptionMutation,
} = apiSlice

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  apiSlice
