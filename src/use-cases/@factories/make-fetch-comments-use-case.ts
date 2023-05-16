import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'
import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { FetchCommentsUseCase } from '../fetch-comments/fetch-comments'

export function makeFetchCommentsUseCase() {
  const commentsRepository = new KnexCommentsRepository()
  const postsRepository = new KnexPostsRepository()

  const useCase = new FetchCommentsUseCase(commentsRepository, postsRepository)
  return useCase
}
