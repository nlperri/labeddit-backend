import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { UpdatePostUseCase } from './update-post'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { hash } from 'bcryptjs'
import { USER_ROLES } from '../../@types/types'
import { UserNotAllowed } from '../@errors/user-not-alowed-error'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let sut: UpdatePostUseCase

describe('Update Post Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    commentsPostsRepository = new InMemoryCommentsPostsRepository()
    postsRepository = new InMemoryPostsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    sut = new UpdatePostUseCase(postsRepository)
  })

  it('should be able to update a post', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const postToUpdate = await postsRepository.create({
      content: 'some post',
      creator_id: user.id,
    })

    const { post } = await sut.execute({
      id: postToUpdate.id,
      content: 'edited post',
      user,
    })

    expect(post).toEqual(
      expect.objectContaining({
        content: 'edited post',
      }),
    )
  })

  it('should throw ResourceNotFoundError when receive an inexistent post id', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    await expect(() =>
      sut.execute({
        id: 'inexistent-id',
        content: 'some content',
        user,
      }),
    ).rejects.toBeInstanceOf(ResourceNotFoundError)
  })

  it('should not be able to update a post if user is not the creator', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 6),
      role: USER_ROLES.NORMAL,
    })

    const userWithPost = await usersRepository.create({
      name: 'Natalia',
      email: 'natalia@example.com',
      password_hash: await hash('123123', 6),
      role: USER_ROLES.NORMAL,
    })

    const postToUpdate = await postsRepository.create({
      content: 'some post',
      creator_id: userWithPost.id,
    })

    await expect(() =>
      sut.execute({
        id: postToUpdate.id,
        content: 'some content',
        user,
      }),
    ).rejects.toBeInstanceOf(UserNotAllowed)
  })
})
