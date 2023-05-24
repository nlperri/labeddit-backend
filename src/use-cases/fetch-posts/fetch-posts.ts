import { FetchPostsOutput } from '../../@types/types'
import { PostsRepository } from '../../repositories/posts-repository'

interface FetchPostsUseCaseRequest {
  page: number
}

interface FetchPostsUseCaseResponse {
  posts: FetchPostsOutput[]
}

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({
    page,
  }: FetchPostsUseCaseRequest): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.fetch(page)

    return {
      posts,
    }
  }
}
