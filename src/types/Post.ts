export interface PostData {
  id: string
  title: string
  selftext: string
  selftext_html: string
  thumbnail: string
  created: number
  num_comments: number
  author: string
  score: number
  permalink: string
}

export interface Post {
  kind: string
  data: PostData
}
