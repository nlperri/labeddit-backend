import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { GetPostUseCase } from '../get-post/get-post'

export function makeGetPostUseCase() {
  const postsRepository = new KnexPostsRepository()
  const useCase = new GetPostUseCase(postsRepository)

  return useCase
}
