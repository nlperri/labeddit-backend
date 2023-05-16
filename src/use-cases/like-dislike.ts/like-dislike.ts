import { CommentsPostsRepository } from '../../repositories/comments-posts-repository'
import { CommentsRepository } from '../../repositories/comments-repository'
import { likeDislikeRepository } from '../../repositories/like-dislike-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'

const LIKE = 1
const DISLIKE = 2

interface LikeDislikeUseCaseRequest {
  like: boolean
  contentId: string
  userId: string
}

export class LikeDislikeUseCase {
  constructor(
    private likeDislikeRepository: likeDislikeRepository,
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
    private commentsPostsRepository: CommentsPostsRepository,
  ) {}

  async execute({
    like,
    contentId,
    userId,
  }: LikeDislikeUseCaseRequest): Promise<void> {
    const user = await this.usersRepository.findById(userId)
    const content = await this.commentsPostsRepository.findById(contentId)

    if (!content || !user) {
      throw new ResourceNotFoundError()
    }

    const isContentPost = await this.likeDislikeRepository.isContentPost(
      contentId,
    )

    if (isContentPost) {
      const post = await this.postsRepository.findById(contentId)

      if (!post) {
        throw new Error()
      }

      if (post.creator_id === userId) {
        throw new UserNotAllowed()
      }
    }

    if (!isContentPost) {
      const comment = await this.commentsRepository.findById(contentId)

      if (!comment) {
        throw new Error()
      }

      if (comment.creator_id === userId) {
        throw new UserNotAllowed()
      }
    }

    const isContentAlreadyLikedOrDisliked =
      await this.likeDislikeRepository.findByIds(contentId, userId)

    if (!isContentAlreadyLikedOrDisliked) {
      await this.likeDislikeRepository.create({
        like,
        contentId,
        userId,
      })

      if (isContentPost) {
        if (like) {
          await this.postsRepository.dislike(contentId, true)
          await this.postsRepository.like(contentId)
        }
        if (!like) {
          await this.postsRepository.like(contentId, true)
          await this.postsRepository.dislike(contentId)
        }
        return
      }
      if (like) {
        await this.commentsRepository.dislike(contentId, true)
        await this.commentsRepository.like(contentId)
      }
      if (!like) {
        await this.commentsRepository.like(contentId, true)
        await this.commentsRepository.dislike(contentId)
      }
      return
    }

    const likeInDatabase = await this.likeDislikeRepository.findByIds(
      contentId,
      userId,
    )

    const isLikedInDatabase = likeInDatabase?.like === LIKE
    const isDislikedInDatabase = likeInDatabase?.like === DISLIKE

    const isLikeTrueAndAlreadyLiked = like && isLikedInDatabase
    const isLikeTrueAndAlreadyDisliked = like && isDislikedInDatabase
    const isLikeFalseAndAlreadyDisliked = !like && isDislikedInDatabase

    const isContentDislikedAndUserWantToLike =
      isLikeTrueAndAlreadyDisliked && like
    const isContentLikedAndUserWantToDislike =
      isLikeTrueAndAlreadyLiked && !like

    if (isContentPost) {
      if (isLikeTrueAndAlreadyLiked) {
        await this.likeDislikeRepository.delete(contentId, userId)
        await this.postsRepository.like(contentId, true)
        return
      }

      if (isLikeFalseAndAlreadyDisliked) {
        await this.likeDislikeRepository.delete(contentId, userId)
        await this.postsRepository.dislike(contentId, true)
        return
      }

      if (isContentDislikedAndUserWantToLike) {
        await this.postsRepository.like(contentId)
        await this.postsRepository.dislike(contentId, true)
        await this.likeDislikeRepository.update(contentId, userId, LIKE)
        return
      }

      if (!isContentLikedAndUserWantToDislike) {
        await this.postsRepository.like(contentId, true)
        await this.postsRepository.dislike(contentId)
        await this.likeDislikeRepository.update(contentId, userId, DISLIKE)

        return
      }

      return
    }

    if (isLikeTrueAndAlreadyLiked) {
      await this.likeDislikeRepository.delete(contentId, userId)
      await this.commentsRepository.like(contentId, true)
      return
    }

    if (isLikeFalseAndAlreadyDisliked) {
      await this.likeDislikeRepository.delete(contentId, userId)
      await this.commentsRepository.dislike(contentId, true)
      return
    }

    if (isContentDislikedAndUserWantToLike) {
      await this.commentsRepository.like(contentId)
      await this.commentsRepository.dislike(contentId, true)
      await this.likeDislikeRepository.update(contentId, userId, LIKE)
      return
    }

    if (!isContentLikedAndUserWantToDislike) {
      await this.commentsRepository.like(contentId, true)
      await this.commentsRepository.dislike(contentId)
      await this.likeDislikeRepository.update(contentId, userId, DISLIKE)

      return
    }
  }
}
