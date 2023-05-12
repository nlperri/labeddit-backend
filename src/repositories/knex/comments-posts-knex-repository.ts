import { CommentsPostsCreateInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import { CreateCommentPostDTO } from '../../dtos/create-comment-post.dto'

import { CommentsPostsRepository } from '../comments-posts-repository'

export class KnexCommentsPostsRepository
  extends Db
  implements CommentsPostsRepository
{
  async create({ provider_id, is_post }: CommentsPostsCreateInput) {
    const result = CreateCommentPostDTO.build({
      provider_id,
      is_post,
    })

    await Db.connection('comments_posts').insert(result)

    return result
  }
  async findById(id: string) {
    const result = await Db.connection('comments_posts').where({ id }).first()

    return result
  }
  async delete(id: string) {
    await Db.connection('comments_posts').del().where({ id })
  }
}
