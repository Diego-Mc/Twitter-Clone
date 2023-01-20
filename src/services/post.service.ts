import { PostProps } from './../types/models'
import { utilService } from './util.service'
import { httpService } from './http.service'
import { userService } from './user.service'

const BASE_URL = 'posts'

export const postService = {
  generatePostHtml,
  getEmptyPost,
}
// window.postService = postService
function generatePostHtml(post: PostProps) {
  const hashtags = utilService.getHashtags(post.text)
  let html = post.text
  for (const hashtag of hashtags) {
    html = html.replace(
      hashtag,
      `<a class="tag" href="testing!!">${hashtag}</a>`
    )
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
