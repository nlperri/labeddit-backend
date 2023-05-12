import { KnexCommentsRepository } from '../../repositories/knex/comments-knex-repository'
import { KnexLikeDislikeRepository } from '../../repositories/knex/like-dislike-knex-repository'
import { KnexPostsRepository } from '../../repositories/knex/posts-knex-repository'
import { KnexUsersRepository } from '../../repositories/knex/users-knex-repository'
import { LikeDislikeUseCase } from '../like-dislike-post.ts/like-dislike'

export function makeLikeDislikeUseCase() {
  const likeDislikeRepository = new KnexLikeDislikeRepository()
  const postsRepository = new KnexPostsRepository()
  const usersRepository = new KnexUsersRepository()
  const commentsRepository = new KnexCommentsRepository()
  const useCase = new LikeDislikeUseCase(
    likeDislikeRepository,
    postsRepository,
    usersRepository,
    commentsRepository,
  )

  return useCase
}
