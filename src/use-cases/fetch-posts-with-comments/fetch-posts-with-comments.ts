import { FetchPostsWithCommentsOutput } from '../../@types/types'
import { PostsRepository } from '../../repositories/posts-repository'

interface FetchPostsUseCaseResponse {
  posts: FetchPostsWithCommentsOutput[]
}

export class FetchPostsWihCommentsUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute(): Promise<FetchPostsUseCaseResponse> {
    const posts = await this.postsRepository.fetchPostsWithComments()
   
    return {
      posts,
    }
  }
}
