import {
  FetchPostsOutput,
  Post,
  PostCreateInput,
  PostEditInput,
} from '../@types/types'

export interface PostsRepository {
  create(data: PostCreateInput): Promise<Post>
  findById(id: string): Promise<Post | null>
  update(data: PostEditInput): Promise<Post | null>
  fetchPosts(): Promise<FetchPostsOutput[] | []>
}
