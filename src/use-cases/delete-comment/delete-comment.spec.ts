import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'
import { USER_ROLES } from '../../@types/types'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { DeleteCommentUseCase } from './delete-comment'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let likeDislikeRepository: InMemoryLikeDislikeRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: DeleteCommentUseCase

describe('Delete Comment Use Case', () => {
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
    likeDislikeRepository = new InMemoryLikeDislikeRepository(
      commentsPostsRepository,
    )
    sut = new DeleteCommentUseCase(
      commentsRepository,
      likeDislikeRepository,
      commentsPostsRepository,
    )
  })

  it('should be able to delete a comment', async () => {
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

    const comment = await commentsRepository.create({
      content: 'some comment',
      creator_id: user.id,
      post_id: post.id,
    })

    await sut.execute({ id: comment.id, user })

    const comments = commentsRepository.items

    expect(comments).toHaveLength(0)
  })

  it('should throw ResourceNotFoundError when receive an inexistent comment id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
    })

    await expect(() =>
      sut.execute({ id: 'inexistent-id', user: user }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should be able to delete a comment if user role is ADMIN', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.ADMIN,
    })

    const userWithPostAndComment = await usersRepository.create({
      name: 'Natalia',
      email: 'natalia@gmail.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const post = await postsRepository.create({
      content: 'some post',
      creator_id: userWithPostAndComment.id,
    })

    const comment = await commentsRepository.create({
      content: 'some comment',
      creator_id: userWithPostAndComment.id,
      post_id: post.id,
    })

    await sut.execute({ id: comment.id, user })

    const comments = commentsRepository.items

    expect(comments).toHaveLength(0)
  })

  it('should not be able to delete a comment if comment is not from user or user is not admin', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const userWithPostAndComment = await usersRepository.create({
      name: 'Natalia',
      email: 'natalia@gmail.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const post = await postsRepository.create({
      content: 'some post',
      creator_id: userWithPostAndComment.id,
    })

    const comment = await commentsRepository.create({
      content: 'some comment',
      creator_id: userWithPostAndComment.id,
      post_id: post.id,
    })

    await expect(() =>
      sut.execute({ id: comment.id, user }),
    ).rejects.toBeInstanceOf(UserNotAllowed)
  })

  it('should be able to delete like/dislike from table if comment is already liked or disliked', async () => {
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

    const comment = await commentsRepository.create({
      content: 'some comment',
      creator_id: user.id,
      post_id: post.id,
    })

    await likeDislikeRepository.create({
      like: true,
      contentId: comment.id,
      userId: user.id,
    })

    await sut.execute({ id: comment.id, user })

    const comments = commentsRepository.items

    expect(comments).toHaveLength(0)
  })
})
