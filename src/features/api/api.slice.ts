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
    getPosts: builder.query<any, string | void>({
      queryFn: async (query = undefined, queryApi, extraOptions, baseQuery) => {
        let path = '/posts'
        if (query) path += `?${query}`
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
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Posts', id: _id } as const)
              ),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    //NOTE: I can use "LIST" for home feed, and "EXPLORE" for explore feed etc. this way I get more control over what to refetch
    getPost: builder.query<PostProps, string>({
      query: (postId) => `/posts/${postId}`,
      providesTags: (res, err, postId) => [{ type: 'Posts', id: postId }],
    }),
    //NOTE: I can use "selectFromResult" from getPosts instead of calling getPost
    getPostReplies: builder.query<PostProps[], string>({
      query: (postId) => `/posts/${postId}/replies`,
      providesTags: (res, err, postId) =>
        res
          ? [...res.map(({ _id }) => ({ type: 'Posts', id: _id } as const))]
          : [{ type: 'Posts', id: postId }],
    }),
    addPost: builder.mutation({
      query: (post) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      async onQueryStarted(post, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedPost } = await queryFulfilled
          dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
              posts.unshift(updatedPost)
            })
          )
        } catch (err) {
          console.log('error adding post, invalidating {Posts - LIST}', err)
          dispatch(
            apiSlice.util.invalidateTags([{ type: 'Posts', id: 'LIST' }])
          )
        }
      },
    }),
    addReply: builder.mutation({
      query: ({ post, replyingTo }) => ({
        url: `/posts/${replyingTo._id}`,
        method: 'POST',
        body: post,
      }),
      async onQueryStarted({ post, replyingTo }, { dispatch, queryFulfilled }) {
        try {
          const { data: updatedReply } = await queryFulfilled
          dispatch(
            apiSlice.util.updateQueryData('getPosts', undefined, (posts) => {
              posts.unshift(updatedReply)
            })
          )
          dispatch(
            apiSlice.util.updateQueryData(
              'getPostReplies',
              replyingTo._id,
              (replies) => {
                replies.push(updatedReply)
              }
            )
          )
        } catch (err) {
          console.log('error adding reply, invalidating {Posts - LIST}', err)
          dispatch(
            apiSlice.util.invalidateTags([
              { type: 'Posts', id: replyingTo._id },
            ])
          )
        }
      },
    }),
    likePost: builder.mutation({
      query: ({ post, params, user }) => ({
        url: `/posts/${post._id}/like`,
        method: 'PATCH',
      }),
      async onQueryStarted(
        { post, params, user },
        { dispatch, queryFulfilled }
      ) {
        const findAndUpdate = (posts: PostProps[]) => {
          const userId = userService.getLoggedInUser()._id
          const updatedPost = posts.find(({ _id }) => _id === post._id)
          if (!updatedPost) return
          updatedPost.likes[userId] = !updatedPost.likes[userId]
        }

        const update = (post: PostProps) => {
          const userId = userService.getLoggedInUser()._id
          post.likes[userId] = !post.likes[userId]
        }

        dispatch(
          apiSlice.util.updateQueryData('getPosts', params, findAndUpdate)
        )
        dispatch(
          apiSlice.util.updateQueryData(
            'getTrendPosts',
            undefined,
            (trendSections) => {
              const userId = userService.getLoggedInUser()._id
              trendSections.forEach(
                (section: { title: string; posts: PostProps[] }) => {
                  const updatedPost = section.posts.find(
                    (p) => p?._id === post._id
                  )
                  if (!updatedPost) return
                  updatedPost.likes[userId] = !updatedPost.likes[userId]
                }
              )
            }
          )
        )
        dispatch(
          apiSlice.util.updateQueryData(
            'getBookmarksFromUser',
            user,
            findAndUpdate
          )
        )
        dispatch(
          apiSlice.util.updateQueryData(
            'getPostReplies',
            post.repliedTo,
            findAndUpdate
          )
        )
        dispatch(apiSlice.util.updateQueryData('getPost', post._id, update))
        try {
          await queryFulfilled
        } catch (err) {
          console.log('error liking post, invalidating {Posts - post._id}', err)
          dispatch(
            apiSlice.util.invalidateTags([{ type: 'Posts', id: post._id }])
          )
        }
      },
    }),
    bookmarkPost: builder.mutation({
      query: (postId) => ({
        url: `/posts/${postId}/bookmark`,
        method: 'PATCH',
      }),
      async onQueryStarted(postId, { dispatch, queryFulfilled }) {
        dispatch(
          apiSlice.util.updateQueryData(
            'getLoggedInUser',
            undefined,
            (user: UserProps) => {
              const bookmarkIdx = user.bookmarks.indexOf(postId)
              if (bookmarkIdx < 0) user.bookmarks.push(postId)
              else user.bookmarks.splice(bookmarkIdx, 1)
            }
          )
        )
        try {
          await queryFulfilled
        } catch (err) {
          console.log(
            'error bookmarking post, invalidating {LoggedInUser}',
            err
          )
          dispatch(apiSlice.util.invalidateTags([{ type: 'LoggedInUser' }]))
        }
      },
    }),
    getBookmarksFromUser: builder.query<any, UserProps>({
      queryFn: async (user, queryApi, extraOptions, baseQuery) => {
        if (!user) return { data: null }

        const bookmarks = await Promise.all(
          user.bookmarks.map((bookmark) => baseQuery(`posts/${bookmark}`))
        )
        const merged = [...bookmarks?.map((result: any) => result.data)]
        return { data: merged }
      },
      providesTags: (res, err, user) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Posts', id: _id } as const)
              ),
              { type: 'Posts', id: 'BOOKMARKS' },
            ]
          : [{ type: 'Posts', id: 'BOOKMARKS' }],
    }),
    /* TRENDS/TAGS */
    getTrends: builder.query<TagProps[], void>({
      query: () => '/tags',
      providesTags: (res, err) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Tags', id: _id } as const)
              ),
              { type: 'Tags', id: 'TRENDS' },
            ]
          : [{ type: 'Tags', id: 'TRENDS' }],
    }),
    getTrendPosts: builder.query<any, void>({
      queryFn: async (args, queryApi, extraOptions, baseQuery) => {
        const trends = await baseQuery(`/tags`)
        if (!trends.data) return { data: 'ERROR' }

        const postsPrms = (trends.data as TagProps[]).map(async (tag) => {
          const res = await baseQuery(`/tags/${tag.tagName}`)
          return { title: tag.tagName, posts: res.data }
        })

        const trendPosts = await Promise.all(postsPrms)
        return { data: trendPosts }
      },
      providesTags: (res, err) =>
        res
          ? [
              ...res.map(
                ({ posts: { _id } }: any) =>
                  ({ type: 'Posts', id: _id } as const)
              ),
              { type: 'Posts', id: 'EXPLORE' },
            ]
          : [{ type: 'Posts', id: 'EXPLORE' }],
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
