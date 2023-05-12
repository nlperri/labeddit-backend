import { TokenPayload, USER_ROLES } from '../../@types/types'
import { CommentsPostsRepository } from '../../repositories/comments-posts-repository'
import { CommentsRepository } from '../../repositories/comments-repository'
import { likeDislikeRepository } from '../../repositories/like-dislike-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'

interface DeleteCommentUseCaseRequest {
  id: string
  user: TokenPayload
}

export class DeleteCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private likeDislikeRepository: likeDislikeRepository,
    private commentsPostsRepository: CommentsPostsRepository,
  ) {}

  async execute({ id, user }: DeleteCommentUseCaseRequest): Promise<void> {
    const comment = await this.commentsRepository.findById(id)

    if (!comment) {
      throw new ResourceNotFoundError('Invalid comment id')
    }
    const isUserAdmin = user.role === USER_ROLES.ADMIN
    const isUserTheCreator = user.id === comment.creator_id

    await this.commentsPostsRepository.delete(id)

    const isCommentLiked = await this.likeDislikeRepository.findByIds(
      id,
      user.id,
    )

    if (isCommentLiked) {
      await this.likeDislikeRepository.delete(id, user.id)
    }

    if (isUserAdmin || isUserTheCreator) {
      await this.commentsRepository.delete(id)
      return
    }

    throw new UserNotAllowed()
  }
}
