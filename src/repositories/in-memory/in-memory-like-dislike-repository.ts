import { LikeDislike, LikeDislikeInput } from '../../@types/types'
import { likeDislikeRepository } from '../like-dislike-repository'
import { InMemoryCommentsPostsRepository } from './in-memory-comments-posts-repository'

export class InMemoryLikeDislikeRepository implements likeDislikeRepository {
  constructor(
    private readonly commentsPostsRepository: InMemoryCommentsPostsRepository,
  ) {}
  public items: LikeDislike[] = []
  async create({ like, contentId, userId }: LikeDislikeInput) {
    const newLikeDislike = {
      like: like ? 1 : 2,
      content_id: contentId,
      user_id: userId,
    }

    this.items.push(newLikeDislike)
  }

  async findByIds(contentId: string, userId: string) {
    const postAlreadyLiked = this.items.find((item) => {
      if (item.content_id === contentId && item.user_id === userId) {
        return item
      }
    })

    return postAlreadyLiked
  }

  async delete(contentId: string, userId: string) {
    const postIndex = this.items.findIndex((item) => {
      if (item.content_id === contentId ?? item.user_id === userId) {
        return item
      }
    })

    this.items.splice(postIndex, 1)
  }
  async update(contentId: string, userId: string, likeOrDislike: number) {
    const post = this.items.map((item) => {
      if (item.content_id === contentId && item.user_id === userId) {
        return {
          ...item,
          like: likeOrDislike,
        }
      }
      return item
    })

    this.items = post
  }

  async isContentPost(contentId: string) {
    const providerId = this.commentsPostsRepository.items.find(
      (item) => contentId === item.post_id,
    )

    const postId = providerId?.post_id

    return !!postId
  }
}
