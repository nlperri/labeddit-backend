import {
  Comment,
  CommentCreateInput,
  CommentEditInput,
  FetchPostsCommentsOutput,
} from '../@types/types'

export interface CommentsRepository {
  create(data: CommentCreateInput): Promise<Comment>
  findById(id: string): Promise<Comment | null>
  update(data: CommentEditInput): Promise<Comment | null>
  fetch(postId: string): Promise<FetchPostsCommentsOutput[] | []>
  delete(id: string): Promise<void>
  like(id: string, shouldDecrement?: boolean): Promise<void>
  dislike(id: string, shouldDecrement?: boolean): Promise<void>
}
