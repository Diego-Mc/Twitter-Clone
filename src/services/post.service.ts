import { PostProps } from './../types/models'
import { utilService } from './util.service'
import { httpService } from './http.service'
import { userService } from './user.service'
import { renderToString } from 'react-dom/server'

const BASE_URL = 'posts'

export const postService = {
  generatePostHtml,
  getEmptyPost,
}
// window.postService = postService
function generatePostHtml(
  post: PostProps,
  linkHTML: (hashtag: string) => string
) {
  const hashtags = utilService.getHashtags(post.text)
  let html = post.text
  for (const hashtag of hashtags) {
    // html = html.replace(
    //   hashtag,
    //   `<span class="tag" onclick="location.assign('/search?search=${hashtag.slice(
    //     1
    //   )}')" >${hashtag}</span>`
    // )

    html = html.replace(hashtag, linkHTML(hashtag))
  }
  return html
}

function getEmptyPost() {
  return {
    text: '',
    imgUrl: '',
    composerId: '',
  }
}
