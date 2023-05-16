import {
  LikeDislike,
  LikeDislikeInput,
  likeDislikePostIdCommentId,
  likeDislikePostIdCommentIdUserId,
  likeDislikeUpdate,
} from '../../@types/types'
import { Db } from '../../database/base-database'
import {
  CreateLikeDislikeCommentDTO,
  CreateLikeDislikePostDTO,
} from '../../dtos/like-dislike.dto'
import { ResourceNotFoundError } from '../../use-cases/@errors/resource-not-found-error'
import { likeDislikeRepository } from '../like-dislike-repository'

export class KnexLikeDislikeRepository
  extends Db
  implements likeDislikeRepository
{
  async isContentPost(contentId: string): Promise<boolean> {
    const content = await Db.connection('comments_posts')
      .where({ post_id: contentId })
      .first()

    if (!content) {
      throw new ResourceNotFoundError('Inexistent content Id')
    }

    if (content.post_id) {
      return true
    }
    return false
  }
  async create({ like, postId, commentId, userId }: LikeDislikeInput) {
    if (postId) {
      const likeDislikePost = CreateLikeDislikePostDTO.build({
        like,
        postId,
        userId,
      })
      await Db.connection('likes_dislikes').insert(likeDislikePost)
      return
    }

    const likeDislikeComment = CreateLikeDislikeCommentDTO.build({
      like,
      commentId,
      userId,
    })
    await Db.connection('likes_dislikes').insert(likeDislikeComment)
  }

  async findById({
    commentId,
    postId,
  }: likeDislikePostIdCommentId): Promise<LikeDislike | undefined> {
    if (postId) {
      const post = await Db.connection('likes_dislikes')
        .where({ post_id: postId })
        .first()

      return post
    }
    const comment = await Db.connection('likes_dislikes')
      .where({ comment_id: commentId })
      .first()

    return comment
  }

  async findByIds({
    userId,
    postId,
    commentId,
  }: likeDislikePostIdCommentIdUserId) {
    if (postId) {
      const post = await Db.connection('likes_dislikes')
        .where({
          post_id: postId,
          user_id: userId,
        })
        .first()
      return post
    }
    const comment = await Db.connection('likes_dislikes')
      .where({
        comment_id: commentId,
        user_id: userId,
      })
      .first()

    return comment
  }

  async delete({ commentId, postId, userId }: likeDislikePostIdCommentId) {
    if (userId) {
      if (postId) {
        await Db.connection('likes_dislikes').del().where({
          post_id: postId,
          user_id: userId,
        })
        return
      }
      await Db.connection('likes_dislikes').del().where({
        comment_id: commentId,
        user_id: userId,
      })
      return
    }

    if (postId) {
      await Db.connection('likes_dislikes').del().where({
        post_id: postId,
      })
      return
    }

    await Db.connection('likes_dislikes').del().where({
      comment_id: commentId,
    })
  }
  async update({
    commentId,
    postId,
    userId,
    likeOrDislike,
  }: likeDislikeUpdate) {
    if (postId) {
      await Db.connection('likes_dislikes')
        .where({
          post_id: postId,
          user_id: userId,
        })
        .update({
          like: likeOrDislike,
        })
      return
    }

    await Db.connection('likes_dislikes')
      .where({
        comment_id: commentId,
        user_id: userId,
      })
      .update({
        like: likeOrDislike,
      })
    return
  }
}
