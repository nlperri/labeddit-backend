import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'
import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { KnexUsersRepository } from '../../repositories/knex/users-knex-repository'
import { CreateCommentUseCase } from '../create-comment/create-comment'

export function makeCreateCommentUseCase() {
  const commentsRepository = new KnexCommentsRepository()
  const userRepository = new KnexUsersRepository()
  const postsRepository = new KnexPostsRepository()

  const useCase = new CreateCommentUseCase(
    commentsRepository,
    userRepository,
    postsRepository,
  )
  return useCase
}
