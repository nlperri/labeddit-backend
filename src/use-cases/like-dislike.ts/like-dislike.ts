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

    if (isContentPost) {
      const postId = contentId
      const isPostAlreadyLikedOrDisliked =
        await this.likeDislikeRepository.findByIds({ userId, postId })

      if (!isPostAlreadyLikedOrDisliked) {
        await this.likeDislikeRepository.create({
          like,
          postId,
          userId,
        })
        if (like) {
          await this.postsRepository.dislike(postId, true)
          await this.postsRepository.like(postId)
        }
        if (!like) {
          await this.postsRepository.like(postId, true)
          await this.postsRepository.dislike(postId)
        }
        return
      }

      const likeInDatabase = await this.likeDislikeRepository.findByIds({
        postId,
        userId,
      })

      const isLikedInDatabase = likeInDatabase?.like === LIKE
      const isDislikedInDatabase = likeInDatabase?.like === DISLIKE

      const isLikeTrueAndAlreadyLiked = like && isLikedInDatabase
      const isLikeTrueAndAlreadyDisliked = like && isDislikedInDatabase
      const isLikeFalseAndAlreadyDisliked = !like && isDislikedInDatabase

      const isPostDislikedAndUserWantToLike =
        isLikeTrueAndAlreadyDisliked && like
      const isPostLikedAndUserWantToDislike = isLikeTrueAndAlreadyLiked && !like

      if (isLikeTrueAndAlreadyLiked) {
        await this.likeDislikeRepository.delete({ postId, userId })
        await this.postsRepository.like(postId, true)
        return
      }

      if (isLikeFalseAndAlreadyDisliked) {
        await this.likeDislikeRepository.delete({ postId, userId })
        await this.postsRepository.dislike(postId, true)
        return
      }

      if (isPostDislikedAndUserWantToLike) {
        await this.postsRepository.like(postId)
        await this.postsRepository.dislike(postId, true)
        await this.likeDislikeRepository.update({
          userId,
          likeOrDislike: LIKE,
          postId,
        })
        return
      }

      if (!isPostLikedAndUserWantToDislike) {
        await this.postsRepository.like(postId, true)
        await this.postsRepository.dislike(postId)
        await this.likeDislikeRepository.update({
          userId,
          likeOrDislike: DISLIKE,
          postId,
        })

        return
      }

      return
    }

    const commentId = contentId
    const isCommentAlreadyLikedOrDisliked =
      await this.likeDislikeRepository.findByIds({ commentId, userId })

    if (!isCommentAlreadyLikedOrDisliked) {
      await this.likeDislikeRepository.create({
        like,
        commentId,
        userId,
      })
      if (like) {
        await this.commentsRepository.dislike(commentId, true)
        await this.commentsRepository.like(commentId)
      }
      if (!like) {
        await this.commentsRepository.like(commentId, true)
        await this.commentsRepository.dislike(commentId)
      }
      return
    }

    const likeInDatabase = await this.likeDislikeRepository.findByIds({
      commentId,
      userId,
    })

    const isLikedInDatabase = likeInDatabase?.like === LIKE
    const isDislikedInDatabase = likeInDatabase?.like === DISLIKE

    const isLikeTrueAndAlreadyLiked = like && isLikedInDatabase
    const isLikeTrueAndAlreadyDisliked = like && isDislikedInDatabase
    const isLikeFalseAndAlreadyDisliked = !like && isDislikedInDatabase

    const isCommentDislikedAndUserWantToLike =
      isLikeTrueAndAlreadyDisliked && like
    const isCommentLikedAndUserWantToDislike =
      isLikeTrueAndAlreadyLiked && !like

    if (isLikeTrueAndAlreadyLiked) {
      await this.likeDislikeRepository.delete({ commentId, userId })
      await this.commentsRepository.like(commentId, true)
      return
    }

    if (isLikeFalseAndAlreadyDisliked) {
      await this.likeDislikeRepository.delete({ commentId, userId })
      await this.commentsRepository.dislike(commentId, true)
      return
    }

    if (isCommentDislikedAndUserWantToLike) {
      await this.commentsRepository.like(commentId)
      await this.commentsRepository.dislike(commentId, true)
      await this.likeDislikeRepository.update({
        userId,
        likeOrDislike: LIKE,
        commentId,
      })
      return
    }

    if (!isCommentLikedAndUserWantToDislike) {
      await this.commentsRepository.like(commentId, true)
      await this.commentsRepository.dislike(commentId)
      await this.likeDislikeRepository.update({
        userId,
        likeOrDislike: DISLIKE,
        commentId,
      })

      return
    }
  }
}
