import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'
import { KnexUsersRepository } from '../../repositories/knex/users-knex-repository'
import { UpdateCommentUseCase } from '../update-comment/update-comment'

export function makeUpdateCommentUseCase() {
  const commentsRepository = new KnexCommentsRepository()
  const usersRepository = new KnexUsersRepository()

  const useCase = new UpdateCommentUseCase(commentsRepository, usersRepository)
  return useCase
}
