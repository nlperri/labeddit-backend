import { FetchCommentsOutput } from '../../@types/types'
import { CommentsRepository } from '../../repositories/comments-repository'
import { PostsRepository } from '../../repositories/posts-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'

interface FetchCommentsUseCaseRequest {
  postId: string
}

interface FetchCommentsUseCaseResponse {
  comments: FetchCommentsOutput[]
}

export class FetchCommentsUseCase {
  constructor(
    private commentsRepository: CommentsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute({
    postId,
  }: FetchCommentsUseCaseRequest): Promise<FetchCommentsUseCaseResponse> {
    const postExists = await this.postsRepository.findById(postId)

    if (!postExists) {
      throw new ResourceNotFoundError()
    }

    const comments = await this.commentsRepository.fetch(postId)

    return {
      comments,
    }
  }
}
