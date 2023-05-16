import { LikeDislikeInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import { CreateLikeDislikeDTO } from '../../dtos/like-dislike.dto'
import { ResourceNotFoundError } from '../../use-cases/@errors/resource-not-found-error'
import { likeDislikeRepository } from '../like-dislike-repository'

export class KnexLikeDislikeRepository
  extends Db
  implements likeDislikeRepository
{
  async isContentPost(contentId: string): Promise<boolean> {
    const content = await Db.connection('comments_posts')
      .where({ provider_id: contentId })
      .first()

    if (!content) {
      throw new ResourceNotFoundError('Inexistent content Id')
    }

    if (content.post_id) {
      return true
    }
    return false
  }
  async create({ like, contentId, userId }: LikeDislikeInput) {
    const likeDislike = CreateLikeDislikeDTO.build({ like, contentId, userId })

    await Db.connection('likes_dislikes').insert(likeDislike)
  }

  async findByIds(contentId: string, userId: string) {
    const content = await Db.connection('likes_dislikes')
      .where({
        content_id: contentId,
        user_id: userId,
      })
      .first()

    return content
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
