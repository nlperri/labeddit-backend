import {
  CommentsPostsCreateInput,
  CommentsPostsTable,
} from '../../@types/types'
import { CommentsPostsRepository } from '../comments-posts-repository'
import {
  CreateCommentsPostsDTO,
  CreatePostsCommentsDTO,
} from '../../dtos/create-comment-post.dto'

export class InMemoryCommentsPostsRepository
  implements CommentsPostsRepository
{
  public items: CommentsPostsTable[] = []

  async create({ post_id, comment_id }: CommentsPostsCreateInput) {
    if (comment_id) {
      const result = CreateCommentsPostsDTO.build({
        comment_id,
      })

      this.items.push(result)
      return result
    }

    if (post_id) {
      const result = CreatePostsCommentsDTO.build({
        post_id,
      })

      this.items.push(result)
      return result
    }

    return null
  }
  async findById(id: string) {
    const commentsPosts = this.items.find((item) => item.comment_id === id)

    if (commentsPosts) {
      return commentsPosts
    }

    const postsComments = this.items.find((item) => item.post_id === id)

    if (postsComments) {
      return postsComments
    }

    return null
  }
  async delete(id: string) {
    const commentsPostsIndex = this.items.findIndex(
      (item) => item.comment_id === id,
    )

    if (commentsPostsIndex > -1) {
      this.items.splice(commentsPostsIndex, 1)
      return
    }

    const postsCommentsIndex = this.items.findIndex(
      (item) => item.post_id === id,
    )

    this.items.splice(postsCommentsIndex, 1)
  }
}
