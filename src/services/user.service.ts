import { httpService } from './http.service'
// import { socketService } from './socket.service'

const STORAGE_KEY_LOGGED_IN_USER = 'loggedInUser'
const BASE_URL = 'users'

export const userService = {
  login,
  logout, //TODO: add logout functionality to backend
  register,

  getUsers,
  getById,
  getFollowers,
  getFollowings,
  followUser,
  getLoggedInUser,
  saveLocalUser,
  remove, //TODO: add remove functionality to backend
  update, //TODO: add update functionality to backend
  isLoggedIn,
}

// window.userService = userService

interface userCredInterface {
  username: string
  fullName: string
  password: string
  email: string
  imgUrl?: string
  coverUrl?: string
}

interface userInterface {
  username: string
  fullName?: string
  imgUrl?: string
  coverUrl?: string
  _id: string
}

async function login(userCred: userCredInterface) {
  const user = await httpService.post('auth/login', userCred)
  if (user) {
    // socketService.login(user._id)
    return saveLocalUser(user)
  }
}
async function register(userCred: userCredInterface) {
  if (!userCred.imgUrl)
    userCred.imgUrl =
      'https://abs.twimg.com/sticky/default_profile_images/default_profile_400x400.png'
  const user = await httpService.post('auth/register', userCred)
  // socketService.login(user._id)
  return saveLocalUser(user)
}
async function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGED_IN_USER)
  // socketService.logout()
  return await httpService.post('auth/logout')
}

function getUsers() {
  return httpService.get(BASE_URL)
}

async function getById(userId: string) {
  const user = await httpService.get(`${BASE_URL}/${userId}`)
  return user
}
async function getFollowers(userId: string) {
  const followers = await httpService.get(`${BASE_URL}/${userId}/followers`)
  return followers
}
async function getFollowings(userId: string) {
  const followings = await httpService.get(`${BASE_URL}/${userId}/followings`)
  return followings
}
function followUser(userId: string, userToFollowId: string) {
  return httpService.patch(`${BASE_URL}/${userId}/${userToFollowId}`)
}
function remove(userId: string) {
  return httpService.delete(`${BASE_URL}/${userId}`)
}

async function update(user: userInterface) {
  user = await httpService.put(`${BASE_URL}/${user._id}`, user)
  return saveLocalUser(user)
}

function saveLocalUser(user: userInterface) {
  user = {
    _id: user._id,
    username: user.username,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGED_IN_USER, JSON.stringify(user))
  return user
}

function getLoggedInUser() {
  const sessionUser = sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER)
  if (!sessionUser) throw new Error('No logged in user in sessionStorage')
  return JSON.parse(sessionUser)
}

function isLoggedIn() {
  const sessionUser = sessionStorage.getItem(STORAGE_KEY_LOGGED_IN_USER)
  return !!sessionUser
}
