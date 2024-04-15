import { Post } from "@/types/Post"

export interface PostListData {
  before: null | string
  after: null | string
  children: Post[]
}

export interface PostList {
  kind: "Listing"
  data: PostListData
}
