import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { CreateCommentUseCase } from './create-comment'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let likeDislikeRepository: InMemoryLikeDislikeRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: CreateCommentUseCase

describe('Create Comment Use Case', () => {
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
    sut = new CreateCommentUseCase(
      commentsRepository,
      usersRepository,
      postsRepository,
    )
  })

  it('should be able to create a comment', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some content',
      creator_id: user.id,
    })

    const { comment } = await sut.execute({
      content: 'some post',
      userId: user.id,
      postId: post.id,
    })

    expect(comment.id).toEqual(expect.any(String))
  })

  it('should not be able to create a comment with inexistent user id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some content',
      creator_id: user.id,
    })

    await expect(() =>
      sut.execute({
        content: 'some post',
        userId: 'inexistent-id',
        postId: post.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to create a comment with inexistent post id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await postsRepository.create({
      content: 'some content',
      creator_id: user.id,
    })

    await expect(() =>
      sut.execute({
        content: 'some post',
        userId: user.id,
        postId: 'some-inexistent-post-id',
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })
})
