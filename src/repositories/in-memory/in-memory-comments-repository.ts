import { randomUUID } from 'crypto'
import { Comment, CommentCreateInput, PostEditInput } from '../../@types/types'
import { InMemoryUsersRepository } from './in-memory-users-repository'
import { CommentsRepository } from '../comments-repository'
import { InMemoryCommentsPostsRepository } from './in-memory-comments-posts-repository'

export class InMemoryCommentsRepository implements CommentsRepository {
  constructor(
    private readonly userRepository: InMemoryUsersRepository,
    private readonly commentsPostsRepository: InMemoryCommentsPostsRepository,
  ) {}
  public items: Comment[] = []

  async findByPostId(id: string) {
    const comment = this.items.filter((item) => item.post_id === id)

    return comment
  }
  async create({ content, creator_id, post_id }: CommentCreateInput) {
    const comment = {
      id: randomUUID(),
      creator_id,
      content,
      post_id,
      created_at: new Date(),
    }
    this.items.push(comment)

    await this.commentsPostsRepository.create({
      comment_id: comment.id,
    })

    return comment
  }

  async findById(id: string) {
    const comment = this.items.find((item) => item.id === id)

    if (!comment) {
      return null
    }

    return comment
  }

  async update({ id, content }: PostEditInput) {
    const commentToEdit = this.items.find((item) => item.id === id)

    if (!commentToEdit) {
      return null
    }

    const comment = { ...commentToEdit, content, update: new Date() }

    return comment
  }

  async fetch(postId: string) {
    const users = this.userRepository.items
    const commentsOnPost = this.items.filter((item) => postId === item.post_id)

    const formattedComments = await Promise.all(
      commentsOnPost.map(async (item) => {
        const id = item.id
        const postId = item.post_id
        const content = item.content
        const likes = item.likes ?? 0
        const dislikes = item.dislikes ?? 0
        const createdAt = new Date(item.created_at).toISOString()
        const updatedAt = item.updated_at
          ? new Date(item.updated_at).toISOString()
          : 'no updates'
        const user = users.find((user) => user.id === item.creator_id)
        if (!user) {
          throw new Error('Post without user x.x')
        }
        const creator = {
          id: item.creator_id,
          name: user.id,
        }

        return {
          id,
          postId,
          content,
          likes,
          dislikes,
          createdAt,
          updatedAt,
          creator,
        }
      }),
    )
    return formattedComments
  }

  async delete(id: string) {
    const commentIndex = this.items.findIndex((item) => item.id === id)
    this.items.splice(commentIndex, 1)
  }

  async like(id: string, shouldDecrement: boolean = false) {
    const comment = await this.findById(id)

    if (!comment) {
      throw new Error()
    }

    if (shouldDecrement) {
      const comments = this.items.map((item) => {
        if (item.id === comment.id) {
          return {
            ...item,
            likes: item.likes
              ? item.likes - 1 === 0
                ? undefined
                : item.likes - 1
              : item.likes,
          }
        }
        return item
      })
      this.items = comments
      return
    }

    const comments = this.items.map((item) => {
      if (item.id === comment.id) {
        return {
          ...item,
          likes: item.likes ? item.likes++ : 1,
        }
      }

      return item
    })

    this.items = comments
  }
  async dislike(id: string, shouldDecrement: boolean = false) {
    const comment = await this.findById(id)

    if (!comment) {
      throw new Error()
    }

    if (shouldDecrement) {
      const comments = this.items.map((item) => {
        if (item.id === comment.id) {
          return {
            ...item,
            dislikes: item.dislikes
              ? item.dislikes - 1 === 0
                ? undefined
                : item.dislikes - 1
              : item.dislikes,
          }
        }
        return item
      })
      this.items = comments
      return
    }

    const comments = this.items.map((item) => {
      if (item.id === comment.id) {
        return {
          ...item,
          dislikes: item.dislikes ? item.dislikes++ : 1,
        }
      }

      return item
    })
    this.items = comments
  }
}
