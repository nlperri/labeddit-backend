import {
  FetchPostsOutput,
  FetchPostsWithCommentsOutput,
  GetPost,
  Post,
  PostCreateInput,
  PostEditInput,
} from '../@types/types'

export interface PostsRepository {
  create(data: PostCreateInput): Promise<Post>
  findById(id: string): Promise<Post | null>
  update(data: PostEditInput): Promise<Post | null>
  fetch(): Promise<FetchPostsOutput[] | []>
  fetchPostsWithComments(): Promise<any>
  delete(id: string): Promise<void>
  like(id: string, shouldDecrement?: boolean): Promise<void>
  dislike(id: string, shouldDecrement?: boolean): Promise<void>
  getPost(id: string): Promise<GetPost | null>
}
