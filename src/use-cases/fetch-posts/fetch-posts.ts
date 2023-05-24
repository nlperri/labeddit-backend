import { FetchPostsOutput } from '../../@types/types'
import { PostsRepository } from '../../repositories/posts-repository'

interface FetchPostsUseCaseResponse {
  posts: FetchPostsOutput[]
}

export class FetchPostsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute(): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.fetch()

    return {
      posts,
    }
  }
}
