import {
  Comment,
  CommentEditInputDTO,
  Post,
  PostEditInput,
  PostEditInputDTO,
} from '../@types/types'

export class UpdateCommentDTO {
  private comment: Comment
  private constructor(data: CommentEditInputDTO) {
    this.comment = {
      ...data.comment,
      content: data.content,
      updated_at: new Date().toISOString(),
    }
  }

  static build(input: CommentEditInputDTO) {
    const { comment } = new UpdateCommentDTO(input)
    return comment
  }
}
