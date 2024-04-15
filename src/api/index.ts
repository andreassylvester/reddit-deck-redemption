import axios from "axios"
import { PostList } from "@/types/PostList"

export const BASE_URL = 'https://www.reddit.com/api/v1'

export const getPosts = (category: string, after: string | undefined = undefined, limit: number = 10): Promise<PostList> => {
  return new Promise((resolve, reject) => {
    axios.get(
      `https://www.reddit.com/r/${category}.json?`,
      { params: { limit, after } }
    ).then((response) => {
      resolve(response.data as PostList)
    }).catch((error: any) => {
      console.warn("oops!", error);
      reject(error)
    })
  })
}
