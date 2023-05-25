import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { FetchPostsWihCommentsUseCase } from '../fetch-posts-with-comments/fetch-posts-with-comments'

export function makeFetchPostsWithCommentsUseCase() {
  const postsRepository = new KnexPostsRepository()
  const useCase = new FetchPostsWihCommentsUseCase(postsRepository)

  return useCase
}
