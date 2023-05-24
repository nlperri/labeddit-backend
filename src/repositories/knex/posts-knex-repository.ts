import { Post, PostCreateInput, PostEditInput } from '../../@types/types'
import { Db } from '../../database/base-database'
import { PostsRepository } from '../posts-repository'
import { CreatePostDTO } from '../../dtos/create-post.dto'
import { UpdatePostDTO } from '../../dtos/update-post.dto'
import { CreatePostsCommentsDTO } from '../../dtos/create-comment-post.dto'

export class KnexPostsRepository extends Db implements PostsRepository {
  async create({ content, creator_id }: PostCreateInput) {
    const post = CreatePostDTO.build({ content, creator_id })

    const postInCommentsPosts = CreatePostsCommentsDTO.build({
      post_id: post.id,
    })

    await Db.connection('posts').insert(post)

    await Db.connection('comments_posts').insert(postInCommentsPosts)

    return post
  }

  async findById(id: string) {
    const [result] = await Db.connection('posts').where({ id })

    if (!result) {
      return null
    }

    return result
  }

  async update({ id, content }: PostEditInput) {
    const post = await this.findById(id)

    const postToUpdate = UpdatePostDTO.build({ id, content, post })

    await Db.connection('posts').update(postToUpdate).where({ id })

    return postToUpdate
  }

  async getPost(id: string) {
    const postsTable = 'posts'
    const usersTable = 'users'
    const commentsTable = 'comments'
    const commentsPostsTable = 'comments_posts'
    const postId = id

    const results = await Db.connection('posts')
      .select(
        'posts.id as id',
        'posts.content',
        'posts.likes',
        'posts.dislikes',
        'posts.created_at as createdAt',
        'posts.updated_at as updatedAt',
        Db.connection.raw(
          'JSON_OBJECT("userId", posts.creator_id, "userName", name) as creator',
        ),
      )
      .innerJoin('users', 'users.id', '=', 'posts.creator_id')
      .groupBy('posts.created_at')
      .where('posts.id', postId)

    const formattedPost = results.map((result) => {
      const id = result.id
      const content = result.content
      const likes = result.likes ?? 0
      const dislikes = result.dislikes ?? 0
      const createdAt = result.createdAt
      const updatedAt = result.commentUpdatedAt
        ? result.commentUpdatedAt
        : 'no updates'
      const creator = JSON.parse(result.creator)

      return {
        id,
        content,
        likes,
        dislikes,
        createdAt,
        updatedAt,
        creator: {
          id: creator.userId,
          name: creator.userName,
        },
      }
    })

    const postIdResult = formattedPost[0].id
    const content = formattedPost[0].content
    const likes = formattedPost[0].likes ?? 0
    const dislikes = formattedPost[0].dislikes ?? 0
    const createdAt = formattedPost[0].createdAt
    const updatedAt = formattedPost[0].updatedAt
      ? formattedPost[0].updatedAt
      : 'no updates'

    const creator = formattedPost[0].creator

    const comments = await Db.connection(commentsTable)
      .select(
        'comments.id as id',
        'comments.post_id as postId',
        'comments.content',
        'comments.likes',
        'comments.dislikes',
        'comments.created_at as createdAt',
        'comments.updated_at as updatedAt',
        Db.connection.raw(
          'JSON_OBJECT("userId", comments.creator_id, "userName", name) as creator',
        ),
      )
      .innerJoin(usersTable, 'users.id', '=', 'comments.creator_id')
      .where('comments.post_id', postId)

    const formattedComments = comments.map((result) => {
      const commentCreator = JSON.parse(result.creator)
      const commentCreatorObject = {
        id: commentCreator.userId,
        name: commentCreator.userName,
      }

      return {
        id: result.id,
        content: result.content,
        likes: result.likes ?? 0,
        dislikes: result.dislikes ?? 0,
        createdAt: result.createdAt,
        updatedAt: result.updatedAt ? result.updatedAt : 'no updates',
        creator: commentCreatorObject,
      }
    })

    const formattedResult = {
      id: postIdResult,
      content,
      likes,
      dislikes,
      createdAt,
      updatedAt,
      creator: {
        id: creator.id,
        name: creator.name,
      },
      comments: formattedComments,
    }

    return formattedResult
  }

  async fetch(page: number) {
    const results = await Db.connection('posts')
      .select(
        'posts.id as id',
        'posts.content',
        'posts.likes',
        'posts.dislikes',
        'posts.created_at as createdAt',
        'posts.updated_at as updatedAt',
        Db.connection.raw(
          'JSON_OBJECT("userId", posts.creator_id, "userName", name) as creator',
        ),
      )
      .innerJoin('users', 'users.id', '=', 'posts.creator_id')
      .groupBy('posts.created_at')
      .limit(10)
      .offset(page * 10)

    const formattedResult = results.map((result) => {
      const id = result.id
      const content =
        result.content.length > 200
          ? result.content.substring(0, 200).concat('...')
          : result.content
      const likes = result.likes ?? 0
      const dislikes = result.dislikes ?? 0
      const createdAt = result.createdAt
      const updatedAt = result.commentUpdatedAt
        ? result.commentUpdatedAt
        : 'no updates'
      const creator = JSON.parse(result.creator)

      return {
        id,
        content,
        likes,
        dislikes,
        createdAt,
        updatedAt,
        creator: {
          id: creator.userId,
          name: creator.userName,
        },
      }
    })

    return formattedResult
  }

  async delete(id: string) {
    await Db.connection('posts').del().where({ id })
  }

  async like(id: string, shouldDecrement: boolean = false) {
    const post = await this.findById(id)

    let updatedLikesCount = post.likes

    if (shouldDecrement) {
      updatedLikesCount = Math.max(0, (post.likes || 0) - 1)
    } else {
      updatedLikesCount = (post.likes || 0) + 1
    }

    await Db.connection('posts').where({ id }).update({
      likes: updatedLikesCount,
    })
  }

  async dislike(id: string, shouldDecrement: boolean = false) {
    const post = await this.findById(id)

    if (!post) {
      throw new Error()
    }

    let updatedDislikesCount = post.dislikes

    if (shouldDecrement) {
      updatedDislikesCount = Math.max(0, (post.dislikes || 0) - 1)
    } else {
      updatedDislikesCount = (post.dislikes || 0) + 1
    }

    await Db.connection('posts').where({ id }).update({
      dislikes: updatedDislikesCount,
    })
  }
}
