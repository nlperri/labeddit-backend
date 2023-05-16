import {
  LikeDislike,
  LikeDislikeInput,
  likeDislikePostIdCommentId,
  likeDislikePostIdCommentIdUserId,
  likeDislikeUpdate,
} from '../../@types/types'
import { likeDislikeRepository } from '../like-dislike-repository'
import { InMemoryCommentsPostsRepository } from './in-memory-comments-posts-repository'

export class InMemoryLikeDislikeRepository implements likeDislikeRepository {
  constructor(
    private readonly commentsPostsRepository: InMemoryCommentsPostsRepository,
  ) {}
  public items: LikeDislike[] = []
  async create({ like, postId, commentId, userId }: LikeDislikeInput) {
    if (postId) {
      const newLikeDislike = {
        like: like ? 1 : 2,
        post_id: postId,
        user_id: userId,
      }

      this.items.push(newLikeDislike)
      return
    }

    const newLikeDislike = {
      like: like ? 1 : 2,
      comment_id: commentId,
      user_id: userId,
    }

    this.items.push(newLikeDislike)
  }

  async findByIds({
    userId,
    postId,
    commentId,
  }: likeDislikePostIdCommentIdUserId) {
    if (postId) {
      const postAlreadyLiked = this.items.find((item) => {
        if (item.post_id === postId && item.user_id === userId) {
          return item
        }
      })
      return postAlreadyLiked
    }

    const commentAlreadyLiked = this.items.find((item) => {
      if (item.comment_id === commentId && item.user_id === userId) {
        return item
      }
    })
    return commentAlreadyLiked
  }

  async delete({ commentId, postId, userId }: likeDislikePostIdCommentId) {
    if (userId) {
      if (postId) {
        const postIndex = this.items.findIndex((item) => {
          if (item.post_id === postId ?? item.user_id === userId) {
            return item
          }
        })
        this.items.splice(postIndex, 1)
        return
      }
      const commentIndex = this.items.findIndex((item) => {
        if (item.comment_id === commentId ?? item.user_id === userId) {
          return item
        }
      })
      this.items.splice(commentIndex, 1)
      return
    }
    if (postId) {
      const postIndex = this.items.findIndex((item) => item.post_id === postId)

      this.items.splice(postIndex, 1)
      return
    }
    const commentIndex = this.items.findIndex(
      (item) => item.comment_id === commentId,
    )

    this.items.splice(commentIndex, 1)
    return
  }
  async update({
    commentId,
    postId,
    userId,
    likeOrDislike,
  }: likeDislikeUpdate) {
    if (postId) {
      const post = this.items.map((item) => {
        if (item.post_id === postId && item.user_id === userId) {
          return {
            ...item,
            like: likeOrDislike,
          }
        }
        return item
      })

      this.items = post
      return
    }

    const comment = this.items.map((item) => {
      if (item.comment_id === commentId && item.user_id === userId) {
        return {
          ...item,
          like: likeOrDislike,
        }
      }
      return item
    })

    this.items = comment
  }

  async isContentPost(contentId: string) {
    const providerId = this.commentsPostsRepository.items.find(
      (item) => contentId === item.post_id,
    )

    const postId = providerId?.post_id

    return !!postId
  }

  async findById({
    commentId,
    postId,
  }: likeDislikePostIdCommentId): Promise<LikeDislike | undefined> {
    if (postId) {
      const post = this.items.find((item) => item.post_id === postId)

      if (!post) {
        return undefined
      }

      return post
    }
    const comment = this.items.find((item) => item.comment_id === commentId)

    if (!comment) {
      return undefined
    }

    return comment
  }
}
