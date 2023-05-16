import { CommentCreateInput, PostEditInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import { CommentsRepository } from '../comments-repository'
import { CreateCommentDTO } from '../../dtos/create-comment.dto'
import { CreateCommentsPostsDTO } from '../../dtos/create-comment-post.dto'
import { UpdateCommentDTO } from '../../dtos/update-comment.dto'

export class KnexCommentsRepository extends Db implements CommentsRepository {
  async create({ content, creator_id, post_id }: CommentCreateInput) {
    const comment = CreateCommentDTO.build({
      creator_id,
      content,
      post_id,
    })

    const commentInCommentsPosts = CreateCommentsPostsDTO.build({
      comment_id: comment.id,
    })

    await Db.connection('comments').insert(comment)
    await Db.connection('comments_posts').insert(commentInCommentsPosts)

    return comment
  }

  async findById(id: string) {
    const comment = await Db.connection('comments')
      .where({
        id,
      })
      .first()

    return comment
  }

  async update({ id, content }: PostEditInput) {
    const comment = await this.findById(id)

    const commentToUpdate = UpdateCommentDTO.build({ id, content, comment })

    await Db.connection('comments').update(commentToUpdate).where({ id })

    return commentToUpdate
  }

  async fetch(postId: string) {
    const usersTable = 'users'
    const commentsTable = 'comments'

    const formattedComments = await Db.connection(commentsTable)
      .select(
        'comments.id as id',
        'comments.post_id as postId',
        'comments.content',
        'comments.likes',
        'comments.dislikes',
        'comments.created_at as createdAt',
        'comments.updated_at as updatedAt',
        Db.connection.raw(
          'JSON_OBJECT("id", comments.creator_id, "name", users.name) as creator',
        ),
      )
      .innerJoin(usersTable, 'users.id', '=', 'comments.creator_id')
      .where('comments.post_id', postId)

    const formattedResult = formattedComments.map((result) => {
      const id = result.id
      const postId = result.postId
      const content = result.content
      const likes = result.likes ?? 0
      const dislikes = result.dislikes ?? 0
      const createdAt = result.createdAt
      const updatedAt = result.updatedAt ? result.updatedAt : 'no updates'
      const creator = JSON.parse(result.creator)

      return {
        id,
        postId,
        content,
        likes,
        dislikes,
        createdAt,
        updatedAt,
        creator: {
          id: creator.id,
          name: creator.name,
        },
      }
    })

    return formattedResult
  }

  async delete(id: string) {
    await Db.connection('comments').del().where({ id })
  }

  async like(id: string, shouldDecrement: boolean = false) {
    const comment = await this.findById(id)

    let updatedLikesCount = comment.likes

    if (shouldDecrement) {
      updatedLikesCount = Math.max(0, (comment.likes || 0) - 1)
    } else {
      updatedLikesCount = (comment.likes || 0) + 1
    }

    await Db.connection('comments').where({ id }).update({
      likes: updatedLikesCount,
    })
  }
  async dislike(id: string, shouldDecrement: boolean = false) {
    const comment = await this.findById(id)

    if (!comment) {
      throw new Error()
    }

    let updatedDislikesCount = comment.dislikes

    if (shouldDecrement) {
      updatedDislikesCount = Math.max(0, (comment.dislikes || 0) - 1)
    } else {
      updatedDislikesCount = (comment.dislikes || 0) + 1
    }

    await Db.connection('comments').where({ id }).update({
      dislikes: updatedDislikesCount,
    })
  }
}
