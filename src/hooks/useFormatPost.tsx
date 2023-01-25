import { Link } from 'react-router-dom'
import { utilService } from '../services/util.service'
import { PostProps } from '../types/models'

export const useFormatPost = () => {
  function formatPost(post: PostProps) {
    const hashtags = utilService.getHashtags(post.text)
    let idx = 0
    let res = []
    for (const hashtag of hashtags) {
      const startIdx = post.text.indexOf(hashtag, idx)
      const len = hashtag.length
      if (idx !== startIdx)
        res.push(<span key={idx}>{post.text.slice(idx, startIdx)}</span>)

      res.push(
        <Link
          key={startIdx}
          className="tag"
          to={`/search?search=${hashtag.slice(1)}`}>
          {hashtag}
        </Link>
      )
      idx = startIdx + len
    }
    res.push(<span key={idx}>{post.text.slice(idx)}</span>)
    return res
  }
  return [formatPost]
}
