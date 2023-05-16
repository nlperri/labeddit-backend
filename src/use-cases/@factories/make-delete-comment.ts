import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'

import { DeleteCommentUseCase } from '../delete-comment/delete-comment'

export function makeDeleteCommentUseCase() {
  const commentsRepository = new KnexCommentsRepository()

  const useCase = new DeleteCommentUseCase(commentsRepository)
  return useCase
}
