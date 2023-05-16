import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { FetchCommentsUseCase } from './fetch-comments'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let likeDislikeRepository: InMemoryLikeDislikeRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: FetchCommentsUseCase

describe('Fetch Comments Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    commentsPostsRepository = new InMemoryCommentsPostsRepository()
    commentsRepository = new InMemoryCommentsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    likeDislikeRepository = new InMemoryLikeDislikeRepository(
      commentsPostsRepository,
    )
    postsRepository = new InMemoryPostsRepository(
      usersRepository,
      commentsPostsRepository,
      commentsRepository,
    )
    sut = new FetchCommentsUseCase(commentsRepository, postsRepository)
  })

  it('should not be able to fetch comments if receives inexistent post id', async () => {
    await expect(() =>
      sut.execute({ postId: 'wrong-id' }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to fetch comments from a specific post with post id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: user.id,
    })

    await commentsRepository.create({
      content: 'some comment',
      creator_id: user.id,
      post_id: post.id,
    })

    const { comments } = await sut.execute({ postId: post.id })

    expect(comments).toHaveLength(1)
    expect(comments).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          postId: expect.any(String),
          creator: expect.objectContaining({
            id: expect.any(String),
            name: expect.any(String),
          }),
          content: expect.any(String),
          likes: expect.any(Number),
          dislikes: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
        }),
      ]),
    )
  })
})
