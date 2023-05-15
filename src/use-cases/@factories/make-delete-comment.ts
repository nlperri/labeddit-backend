import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'
import { KnexCommentsPostsRepository } from '../../repositories/knex/comments-posts-knex-repository'
import { KnexLikeDislikeRepository } from '../../repositories/knex/like-dislike-knex-repository'
import { DeleteCommentUseCase } from '../delete-comment/delete-comment'

export function makeDeleteCommentUseCase() {
  const commentsRepository = new KnexCommentsRepository()
  const commentsPostsRepository = new KnexCommentsPostsRepository()
  const likeDislikeRepository = new KnexLikeDislikeRepository()

  const useCase = new DeleteCommentUseCase(
    commentsRepository,
    likeDislikeRepository,
    commentsPostsRepository,
  )
  return useCase
}
