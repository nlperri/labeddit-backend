import { LikeDislike, LikeDislikeInput } from '../@types/types'

export class CreateLikeDislikeDTO {
  private likeDislike: LikeDislike
  private constructor(data: LikeDislikeInput) {
    this.likeDislike = {
      like: data.like ? 1 : 2,
      content_id: data.contentId,
      user_id: data.userId,
    }
  }

  static build(input: LikeDislikeInput) {
    const { likeDislike } = new CreateLikeDislikeDTO(input)
    return likeDislike
  }
}
