import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { USER_ROLES } from '../../@types/types'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { UpdateCommentUseCase } from './update-comment'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: UpdateCommentUseCase

describe('Update Post Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    commentsPostsRepository = new InMemoryCommentsPostsRepository()
    commentsRepository = new InMemoryCommentsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    postsRepository = new InMemoryPostsRepository(
      usersRepository,
      commentsPostsRepository,
      commentsRepository,
    )
    sut = new UpdateCommentUseCase(commentsRepository, usersRepository)
  })

  it('should be able to update a comment', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const post = await postsRepository.create({
      content: 'some post',
      creator_id: user.id,
    })

    const commentToUpdate = await commentsRepository.create({
      content: 'some-content',
      creator_id: user.id,
      post_id: post.id,
    })

    const { comment } = await sut.execute({
      commentId: commentToUpdate.id,
      content: 'updated content',
      userId: user.id,
    })

    expect(comment).toEqual(
      expect.objectContaining({
        content: 'updated content',
      }),
    )
  })

  it('should throw ResourceNotFoundError when receive an inexistent comment id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    await expect(() =>
      sut.execute({
        commentId: 'some-inexistent-comment-id',
        content: 'some content',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a comment if user is not the creator', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const userWithComment = await usersRepository.create({
      name: 'Natalia',
      email: 'natalia@example.com',
      password_hash: await hash('123123', 6),
      role: USER_ROLES.NORMAL,
    })

    const post = await postsRepository.create({
      content: 'some post',
      creator_id: user.id,
    })

    const commentToUpdate = await commentsRepository.create({
      content: 'some post',
      creator_id: userWithComment.id,
      post_id: post.id,
    })

    await expect(() =>
      sut.execute({
        commentId: commentToUpdate.id,
        content: 'some content',
        userId: user.id,
      }),
    ).rejects.toBeInstanceOf(UserNotAllowed)
  })
})
