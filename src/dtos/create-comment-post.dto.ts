import { randomUUID } from 'crypto'
import { CommentPostCreateInput, CommentsPosts } from '../@types/types'

export class CreateCommentPostDTO {
  private commentPost: CommentsPosts
  private constructor(data: CommentPostCreateInput) {
    this.commentPost = {
      id: randomUUID(),
      provider_id: data.provider_id,
      is_post: data.is_post,
    }
  }

  static build(input: CommentPostCreateInput) {
    const { commentPost } = new CreateCommentPostDTO(input)
    return commentPost
  }
}
