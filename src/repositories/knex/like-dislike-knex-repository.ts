import { LikeDislikeInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import { CreateLikeDislikeDTO } from '../../dtos/like-dislike.dto'
import { likeDislikeRepository } from '../like-dislike-repository'

export class KnexLikeDislikeRepository
  extends Db
  implements likeDislikeRepository
{
  async create({ like, contentId, userId }: LikeDislikeInput) {
    const likeDislike = CreateLikeDislikeDTO.build({ like, contentId, userId })

    await Db.connection('likes_dislikes').insert(likeDislike)
  }

  async findByIds(contentId: string, userId: string) {
    const post = await Db.connection('likes_dislikes')
      .where({
        content_id: contentId,
        user_id: userId,
      })
      .first()

    return post
  }

  async delete(contentId: string, userId: string) {
    await Db.connection('likes_dislikes').del().where({
      content_id: contentId,
      user_id: userId,
    })
  }
  async update(contentId: string, userId: string, likeOrDislike: number) {
    await Db.connection('likes_dislikes')
      .where({
        content_id: contentId,
        user_id: userId,
      })
      .update({
        like: likeOrDislike,
      })
  }
}
