import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { DeletePostUseCase } from '../delete-post/delete-post'

export function makeDeletePostUseCase() {
  const postsRepository = new KnexPostsRepository()

  const useCase = new DeletePostUseCase(postsRepository)

  return useCase
}
