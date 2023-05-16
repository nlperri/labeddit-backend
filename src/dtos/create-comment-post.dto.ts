import { randomUUID } from 'crypto'
import {
  CommentCreateInputDTO,
  CommentsPosts,
  PostCreateInputDTO,
  PostsComments,
} from '../@types/types'

export class CreateCommentsPostsDTO {
  private comment: CommentsPosts
  private constructor(data: CommentCreateInputDTO) {
    this.comment = {
      comment_id: data.comment_id,
    }
  }

  static build(input: CommentCreateInputDTO) {
    const { comment } = new CreateCommentsPostsDTO(input)
    return comment
  }
}

export class CreatePostsCommentsDTO {
  private post: PostsComments
  private constructor(data: PostCreateInputDTO) {
    this.post = {
      post_id: data.post_id,
    }
  }

  static build(input: PostCreateInputDTO) {
    const { post } = new CreatePostsCommentsDTO(input)
    return post
  }
}
