import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { CreatePostUseCase } from './create-post'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let likeDislikeRepository: InMemoryLikeDislikeRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: CreatePostUseCase

describe('Create Post Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    commentsPostsRepository = new InMemoryCommentsPostsRepository()
    likeDislikeRepository = new InMemoryLikeDislikeRepository(
      commentsPostsRepository,
    )
    commentsRepository = new InMemoryCommentsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    postsRepository = new InMemoryPostsRepository(
      usersRepository,
      commentsPostsRepository,
      commentsRepository,
    )
    sut = new CreatePostUseCase(postsRepository, usersRepository)
  })

  it('should be able to create a post', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const { post } = await sut.execute({
      content: 'some post',
      userId: user.id,
    })

    expect(post.id).toEqual(expect.any(String))
  })

  it('should not be able to create a post with inexistent user id', async () => {
    await expect(() =>
      sut.execute({
        content: 'some post',
        userId: 'inexistent-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
