import { Comment } from '../../@types/types'
import { CommentsRepository } from '../../repositories/comments-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'

interface CreateCommentUseCaseRequest {
  content: string
  userId: string
  postId: string
}

interface CreateCommentUseCaseResponse {
  comment: Comment
}

export class CreateCommentUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    content,
    userId,
    postId,
  }: CreateCommentUseCaseRequest): Promise<CreateCommentUseCaseResponse> {
    const userIdExists = await this.usersRepository.findById(userId)

    if (!userIdExists) {
      throw new ResourceNotFoundError('Invalid user Id')
    }

    const postIdExists = await this.postsRepository.findById(postId)

    if (!postIdExists) {
      throw new ResourceNotFoundError('Invalid post Id')
    }

    const comment = await this.commentsRepository.create({
      content,
      creator_id: userId,
      post_id: postId,
    })

    return {
      comment,
    }
  }
}
