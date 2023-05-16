import {
  CommentsPostsCreateInput,
  CommentsPostsTable,
  PostsComments,
} from '../@types/types'

export interface CommentsPostsRepository {
  create(data: CommentsPostsCreateInput): Promise<CommentsPostsTable | null>
  findById(id: string): Promise<CommentsPostsTable | null>
  delete(id: string): Promise<void>
}
