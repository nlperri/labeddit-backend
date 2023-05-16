import { LikeDislike, LikeDislikeInput } from '../@types/types'

export class CreateLikeDislikePostDTO {
  private likeDislike: LikeDislike
  private constructor(data: LikeDislikeInput) {
    this.likeDislike = {
      like: data.like ? 1 : 2,
      post_id: data.postId,
      user_id: data.userId,
    }
  }

  static build(input: LikeDislikeInput) {
    const { likeDislike } = new CreateLikeDislikePostDTO(input)
    return likeDislike
  }
}

export class CreateLikeDislikeCommentDTO {
  private likeDislike: LikeDislike
  private constructor(data: LikeDislikeInput) {
    this.likeDislike = {
      like: data.like ? 1 : 2,
      comment_id: data.commentId,
      user_id: data.userId,
    }
  }

  static build(input: LikeDislikeInput) {
    const { likeDislike } = new CreateLikeDislikeCommentDTO(input)
    return likeDislike
  }
}
