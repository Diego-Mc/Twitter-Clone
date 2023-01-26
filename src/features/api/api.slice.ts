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
  tagTypes: [
    'Posts',
    'PostsByUser',
    'Tags',
    'ToFollow',
    'Users',
    'LoggedInUser',
  ],
  endpoints: (builder) => ({
    getPosts: builder.query<PostProps[], string | void>({
      queryFn: async (query = undefined, queryApi, extraOptions, baseQuery) => {
        let path = '/posts'
        if (query) path += `?${query}`
        const result = await baseQuery(path)
        const data = result.data as PostProps[]
        data?.sort((a: PostProps, b: PostProps) => b._id.localeCompare(a._id))
        return { data }
      },
      providesTags: (res) =>
        res
          ? [
              ...res.map(
                ({ _id }: any) => ({ type: 'Posts', id: _id } as const)
              ),
              ...res.map(
                ({ userId }: any) =>
                  ({ type: 'PostsByUser', id: userId } as const)
              ),
              { type: 'Posts', id: 'LIST' },
            ]
          : [{ type: 'Posts', id: 'LIST' }],
    }),
    //NOTE: I can use "LIST" for home feed, and "EXPLORE" for explore feed etc. this way I get more control over what to refetch
    getPost: builder.query<PostProps, string>({
      // query: (postId) => `/posts/${postId}`,
      queryFn: async (postId, queryApi, extraOptions, baseQuery) => {
        if (!postId)
          return {
            error: {
              statusText: 'Not found',
              status: 404,
              data: 'Invalid postId',
            },
          }
        const result = await baseQuery(`/posts/${postId}`)
        const data = result.data as PostProps
        return { data }
      },
      providesTags: (res, err, postId) => [
        { type: 'Posts', id: postId },
        { type: 'PostsByUser', id: res?.userId },
      ],
    }),
    //NOTE: I can use "selectFromResult" from getPosts instead of calling getPost
    getPostReplies: builder.query<PostProps[], string>({
      query: (postId) => `/posts/${postId}/replies`,
      providesTags: (res, err, postId) =>
        res
          ? [
              ...res.map(({ _id }) => ({ type: 'Posts', id: _id } as const)),
              ...res.map(
                ({ userId }) => ({ type: 'PostsByUser', id: userId } as const)
              ),
            ]
          : [{ type: 'Posts', id: postId }],
    }),
    addPost: builder.mutation({
      query: ({ post }) => ({
        url: '/posts',
        method: 'POST',
        body: post,
      }),
      invalidatesTags: [{ type: 'Posts', id: 'LIST' }],
    }),
    addReply: builder.mutation({
      query: ({ post, replyingTo }) => ({
        url: `/posts/${replyingTo._id}`,
        method: 'POST',
        body: post,
      }),
      invalidatesTags: (res, err, { post, replyingTo }) => [
        { type: 'Posts', id: replyingTo._id },
      ],
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
          if (!userId) return //TODO: error
          const isLiked = updatedPost.likes[userId]
          if (isLiked) delete updatedPost.likes[userId]
          else updatedPost.likes[userId] = !updatedPost.likes[userId]
        }

        const update = (post: PostProps) => {
          const userId = userService.getLoggedInUser()._id
          if (!userId) return //TODO: error
          const isLiked = post.likes[userId]
          if (isLiked) delete post.likes[userId]
          else post.likes[userId] = !post.likes[userId]
        }

        dispatch(
          apiSlice.util.updateQueryData('getPosts', params, findAndUpdate)
        )
        dispatch(
          apiSlice.util.updateQueryData(
            'getTrendPosts',
            undefined,
            (trendSections) => {
              const userId = userService.getLoggedInUser()?._id
              if (!userId) return //TODO: error
              trendSections.forEach(
                (section: { title: string; posts: PostProps[] }) => {
                  const updatedPost = section.posts.find(
                    (p) => p?._id === post._id
                  )
                  if (!updatedPost) return
                  const isLiked = updatedPost.likes[userId]
                  if (isLiked) delete updatedPost.likes[userId]
                  else updatedPost.likes[userId] = !updatedPost.likes[userId]
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
            'getUser',
            userService.getLoggedInUser()?._id,
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
      async onQueryStarted(arg, { dispatch, queryFulfilled }): Promise<any> {
        try {
          const { data } = await queryFulfilled
          if (userService.getLoggedInUser()?._id === data?._id) {
          } else if (!userService.getLoggedInUser()?._id && data?._id) {
            sessionStorage.setItem(
              'loggedInUser',
              JSON.stringify({ _id: data._id })
            )
          } else {
            sessionStorage.removeItem('loggedInUser')
            await dispatch(apiSlice.endpoints.logout.initiate())
            throw new Error('not logged in')
          }
          return { data }
        } catch (err) {
          sessionStorage.removeItem('loggedInUser')
        }
      },
      transformErrorResponse: (err) => {},
    }),
    getUser: builder.query<UserProps, string>({
      queryFn: async (userId, queryApi, extraOptions, baseQuery) => {
        if (userId === undefined)
          return {
            error: {
              status: 404,
              statusText: 'User not found.',
              data: 'Invalid userId provided.',
            },
          }
        const user = await baseQuery(`/users/${userId}`)
        if (!user.data)
          return {
            error: {
              status: 404,
              statusText: 'User not found.',
              data: 'User does not exist.',
            },
          }
        return { data: user.data as UserProps }
      },
      providesTags: (res) =>
        res ? [{ type: 'Users', id: res._id }] : ['Users'],
    }),
    getUserId: builder.query<string, string>({
      query: (username) => `/users/get-id/${username}`,
    }),
    getRandomUsersToFollow: builder.query<UserProps[], void>({
      query: () => `/users/random-to-follow`,
      providesTags: (res) =>
        res
          ? [
              ...res.map(({ _id }) => ({ type: 'Users', id: _id } as const)),
              { type: 'Users', id: 'TO_FOLLOW' },
            ]
          : [{ type: 'Users', id: 'TO_FOLLOW' }],
      //TODO: add option to only regenerate a user missing after following him
    }),
    followUser: builder.mutation({
      query: (userToFollowId) => ({
        url: `/users/${userToFollowId}/follow`,
        method: 'PATCH',
      }),
      async onQueryStarted(
        userToFollowId: string,
        { dispatch, queryFulfilled }
      ) {
        try {
          const loggedInUserId = userService.getLoggedInUser()?._id
          if (!loggedInUserId) throw new Error('Not logged in!')
          dispatch(
            apiSlice.util.updateQueryData(
              'getUser',
              userToFollowId,
              (user: UserProps) => {
                const followIdx = user.followers.indexOf(loggedInUserId)
                if (followIdx < 0) user.followers.push(loggedInUserId)
                else user.followers.splice(followIdx, 1)
              }
            )
          )
          dispatch(
            apiSlice.util.updateQueryData(
              'getUser',
              loggedInUserId,
              (user: UserProps) => {
                const followIdx = user.followings.indexOf(userToFollowId)
                if (followIdx < 0) user.followings.push(userToFollowId)
                else user.followings.splice(followIdx, 1)
              }
            )
          )
          dispatch(
            apiSlice.util.updateQueryData(
              'getRandomUsersToFollow',
              undefined,
              (users: UserProps[]) => {
                const user = users.find(({ _id }) => _id === userToFollowId)
                if (!user) return
                const followIdx = user.followers.indexOf(loggedInUserId)
                if (followIdx < 0) user.followers.push(loggedInUserId)
                else user.followers.splice(followIdx, 1)
              }
            )
          )

          await queryFulfilled

          dispatch(
            apiSlice.util.invalidateTags([{ type: 'Users', id: 'TO_FOLLOW' }])
          )
        } catch (err) {
          console.log('error following user, invalidating {LoggedInUser}', err)
          dispatch(apiSlice.util.invalidateTags([{ type: 'LoggedInUser' }]))
        }
      },
    }),
    uploadProfilePic: builder.mutation({
      query: (url) => ({
        url: `/users/upload/profile-img`,
        method: 'PATCH',
        body: { imgUrl: url },
      }),
      invalidatesTags: (res) =>
        res
          ? [
              { type: 'Users', id: res._id },
              { type: 'PostsByUser', id: res._id },
            ]
          : ['LoggedInUser', 'Posts'],
    }),
    uploadCoverPic: builder.mutation({
      query: (url) => ({
        url: `/users/upload/cover-img`,
        method: 'PATCH',
        body: { imgUrl: url },
      }),
      invalidatesTags: (res) =>
        res ? [{ type: 'Users', id: res._id }] : ['LoggedInUser'],
    }),
    updateDescription: builder.mutation({
      query: (description) => ({
        url: `/users/update/description`,
        method: 'PATCH',
        body: { description },
      }),
      invalidatesTags: (res) =>
        res ? [{ type: 'Users', id: res._id }] : ['LoggedInUser'],
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
        window.location.reload()
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
        window.location.reload()
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
        window.location.reload()
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
  useGetUserIdQuery,
  useGetRandomUsersToFollowQuery,
  useFollowUserMutation,
  useUploadProfilePicMutation,
  useUploadCoverPicMutation,
  useUpdateDescriptionMutation,
} = apiSlice

export const { useRegisterMutation, useLoginMutation, useLogoutMutation } =
  apiSlice
