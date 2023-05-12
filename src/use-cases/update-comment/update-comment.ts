import { Comment } from '../../@types/types'
import { CommentsRepository } from '../../repositories/comments-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'

interface UpdateCommentUseCaseRequest {
  commentId: string
  content: string
  userId: string
}

interface UpdateCommentUseCaseResponse {
  comment: Comment
}

export class UpdateCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute({
    content,
    userId,
    commentId,
  }: UpdateCommentUseCaseRequest): Promise<UpdateCommentUseCaseResponse> {
    const userIdExists = await this.usersRepository.findById(userId)

    if (!userIdExists) {
      throw new ResourceNotFoundError('Invalid user Id')
    }

    const commentIdExists = await this.commentsRepository.findById(commentId)

    if (!commentIdExists) {
      throw new ResourceNotFoundError('Invalid comment Id')
    }

    if (commentIdExists.creator_id !== userId) {
      throw new UserNotAllowed()
    }

    const comment = await this.commentsRepository.update({
      content,
      id: commentId,
    })

    if (!comment) {
      throw new Error()
    }

    return {
      comment,
    }
  }
}
