import { randomUUID } from 'crypto'
import { Comment, CommentCreateInput } from '../@types/types'

export class CreateCommentDTO {
  private comment: Comment
  private constructor(data: CommentCreateInput) {
    this.comment = {
      id: randomUUID(),
      creator_id: data.creator_id,
      content: data.content,
      created_at: new Date().toISOString(),
      post_id: data.post_id,
    }
  }

  static build(input: CommentCreateInput) {
    const { comment } = new CreateCommentDTO(input)
    return comment
  }
}
