import { CommentsPosts, CommentsPostsCreateInput } from '../@types/types'

export interface CommentsPostsRepository {
  create(data: CommentsPostsCreateInput): Promise<CommentsPosts>
  findById(id: string): Promise<CommentsPosts | null>
  delete(id: string): Promise<void>
}
