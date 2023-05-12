import { KnexCommentsPostsRepository } from '../../repositories/knex/comments-posts-knex-repository'
import { KnexLikeDislikeRepository } from '../../repositories/knex/like-dislike-knex-repository'
import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { DeletePostUseCase } from '../delete-post/delete-post'

export function makeDeletePostUseCase() {
  const postsRepository = new KnexPostsRepository()
  const likeDislikeRepository = new KnexLikeDislikeRepository()
  const commentsPostsRepository = new KnexCommentsPostsRepository()
  const useCase = new DeletePostUseCase(
    postsRepository,
    likeDislikeRepository,
    commentsPostsRepository,
  )

  return useCase
}
