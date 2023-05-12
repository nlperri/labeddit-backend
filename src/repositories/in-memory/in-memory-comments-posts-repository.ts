import { randomUUID } from 'node:crypto'
import { CommentsPostsCreateInput, CommentsPosts } from '../../@types/types'
import { CommentsPostsRepository } from '../comments-posts-repository'

export class InMemoryCommentsPostsRepository
  implements CommentsPostsRepository
{
  public items: CommentsPosts[] = []

  async create({ provider_id, is_post }: CommentsPostsCreateInput) {
    const commentsPosts = {
      id: randomUUID(),
      provider_id,
      is_post,
    }

    this.items.push(commentsPosts)

    return commentsPosts
  }
  async findById(id: string) {
    const commentsPosts = this.items.find((item) => item.provider_id === id)

    if (!commentsPosts) {
      return null
    }

    return commentsPosts
  }
  async delete(id: string) {
    const commentsPostsIndex = this.items.findIndex(
      (item) => item.provider_id === id,
    )
    this.items.splice(commentsPostsIndex, 1)
  }
}
