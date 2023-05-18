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


    const formattedPost = await Db.connection(postsTable)
      .select(
        'posts.id as id',
        'posts.content',
        'posts.likes',
        'posts.dislikes',
        'posts.created_at as createdAt',
        'posts.updated_at as updatedAt',
        Db.connection.raw(
          'JSON_OBJECT("userId", users.id, "userName", users.name) as creator',
        ),
        'comments.id as commentId',
        'comments.content as commentContent',
        'comments.likes as commentLikes',
        'comments.dislikes as commentDislikes',
        'comments.created_at as commentCreatedAt',
        'comments.updated_at as commentUpdatedAt',
        Db.connection.raw(
          'JSON_OBJECT("commentUserId", u2.id, "commentUserName", u2.name) as commentCreator',
        )
      )
      .leftJoin(commentsPostsTable, 'posts.id', '=', 'comments_posts.post_id')
      .innerJoin(commentsTable, 'posts.id', '=', 'comments.post_id')
      .innerJoin(usersTable, 'users.id', '=', 'posts.creator_id')
      .innerJoin({ u2: usersTable }, 'u2.id', '=', 'comments.creator_id')
      .where('posts.id', postId)


      const postIdResult = formattedPost[0].id
      const content = formattedPost[0].content.lenght > 115 ? formattedPost[0].content.substring(0, 115).concat('...') : formattedPost[0].content
      const likes = formattedPost[0].likes ?? 0
      const dislikes = formattedPost[0].dislikes ?? 0
      const createdAt = formattedPost[0].createdAt
      const updatedAt = formattedPost[0].updatedAt ? formattedPost[0].updatedAt : 'no updates'
      const creator = JSON.parse(formattedPost[0].creator)



      const comments = formattedPost.map((result) => {
        const commentCreator = JSON.parse(result.commentCreator);
        const commentCreatorObject = { id: commentCreator.commentUserId, name: commentCreator.commentUserName };
      
        return {
          id: result.commentId,
          content: result.commentContent,
          likes: result.commentLikes ?? 0,
          dislikes: result.commentDislikes ?? 0,
          createdAt: result.commentCreatedAt,
          updatedAt: result.commentUpdatedAt ? result.commentUpdatedAt : 'no updates',
          creator: commentCreatorObject,
        };
      });

      const formattedResult = {
        id: postIdResult,
        content,
        likes,
        dislikes,
        createdAt,
        updatedAt,
        creator: {
          id: creator.userId,
          name: creator.userName,
        },
        comments
      }

    
    return formattedResult
  }

  async fetch() {
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

    const formattedResult = results.map((result) => {
      const id = result.id
      const content = result.content.substring(0,115).concat('...')
      const likes = result.likes ? result.likes : undefined
      const dislikes = result.dislikes ? result.dislikes : undefined
      const createdAt = result.createdAt
      const updatedAt = result.updatedAt ? result.updatedAt : undefined
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
