import { CommentsPostsCreateInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import {
  CreateCommentsPostsDTO,
  CreatePostsCommentsDTO,
} from '../../dtos/create-comment-post.dto'

import { CommentsPostsRepository } from '../comments-posts-repository'

export class KnexCommentsPostsRepository
  extends Db
  implements CommentsPostsRepository
{
  async create({ post_id, comment_id }: CommentsPostsCreateInput) {
    if (comment_id) {
      const result = CreateCommentsPostsDTO.build({
        comment_id,
      })

      await Db.connection('comments_posts').insert(result)
      return result
    }

    if (post_id) {
      const result = CreatePostsCommentsDTO.build({
        post_id,
      })

      await Db.connection('comments_posts').insert(result)
      return result
    }

    return null
  }
  async findById(id: string) {
    const post = await Db.connection('comments_posts')
      .where({ post_id: id })
      .first()

    if (!post) {
      const comment = await Db.connection('comments_posts')
        .where({ comment_id: id })
        .first()
      return comment
    }
    return post
  }
  async delete(id: string) {
    await Db.connection('comments_posts').del().where({ id })
  }
}
