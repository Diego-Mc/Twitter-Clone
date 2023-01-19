import { httpService } from './http.service'
import { userService } from './user.service'

const BASE_URL = 'posts'

export const postService = {
  query, //TODO: add search functionality to backend
  save,
  addPostReply,
  getFeedPosts,
  getUserPosts,
  getUserPostsAndReplies,
  getUserLikedPosts,
  getUserBookmarkedPosts,
  getById,
  getPostReplies,
  getTagPosts,
  likePost,
  bookmarkPost,
  remove, //TODO: add remove functionality to backend
  getEmptyPost,
}
// window.postService = postService

interface postInterface {
  _id?: string
  text: string
  imgUrl?: string
  composerId?: string
}

function query(filterBy = { txt: '', userId: '' }) {
  return httpService.get(BASE_URL, filterBy)
}

async function save(post: postInterface) {
  var savedPost
  if (post._id) {
    savedPost = await httpService.put(`${BASE_URL}/${post._id}`, post)
  } else {
    post.composerId = userService.getLoggedInUser()._id //TODO: fix
    savedPost = await httpService.post(BASE_URL, post)
  }
  return savedPost
}

async function addPostReply(postId: string, reply: postInterface) {
  const savedMsg = await httpService.post(`${BASE_URL}/${postId}`, reply)
  return savedMsg
}

function getFeedPosts() {
  return httpService.get(BASE_URL)
}
function getUserPosts() {
  const userId = userService.getLoggedInUser()._id //TODO: fix
  return httpService.get(`${BASE_URL}/profile/${userId}`)
}
function getUserPostsAndReplies() {
  const userId = userService.getLoggedInUser()._id //TODO: fix
  return httpService.get(`${BASE_URL}/profile/all/${userId}`)
}
function getUserLikedPosts() {
  const userId = userService.getLoggedInUser()._id //TODO: fix
  return httpService.get(`${BASE_URL}/profile/likes/${userId}`)
}
function getUserBookmarkedPosts() {
  const userId = userService.getLoggedInUser()._id //TODO: fix
  return httpService.get(`${BASE_URL}/profile/bookmarks/${userId}`)
}
function getById(postId: string) {
  return httpService.get(`${BASE_URL}/${postId}`)
}
function getPostReplies(postId: string) {
  return httpService.get(`${BASE_URL}/${postId}/replies`)
}
function getTagPosts(tagName: string) {
  return httpService.get(`${BASE_URL}/tag/${tagName}`)
}

function likePost(postId: string) {
  return httpService.patch(`${BASE_URL}/${postId}/like`)
}
function bookmarkPost(postId: string) {
  return httpService.patch(`${BASE_URL}/${postId}/bookmark`)
}
function remove(postId: string) {
  return httpService.delete(`${BASE_URL}/${postId}`)
}

function getEmptyPost() {
  return {
    text: '',
    imgUrl: '',
    composerId: '',
  }
}
