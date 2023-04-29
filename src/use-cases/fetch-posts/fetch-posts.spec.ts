import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { FetchPostsUseCase } from './fetch-posts'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let sut: FetchPostsUseCase

describe('Fetch Posts Use Case', () => {
  beforeEach(() => {
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository(usersRepository)
    sut = new FetchPostsUseCase(postsRepository)
  })

  it('should be able to fetch posts', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    await postsRepository.create({
      content: 'some-content',
      creator_id: user.id,
    })

    await postsRepository.create({
      content: 'another-content',
      creator_id: user.id,
    })

    const { posts } = await sut.execute()

    expect(posts).toHaveLength(2)
    expect(posts).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          content: expect.any(String),
          likes: expect.any(Number),
          dislikes: expect.any(Number),
          createdAt: expect.any(String),
          updatedAt: expect.any(String),
          creator: {
            id: expect.any(String),
            name: expect.any(String),
          },
        }),
      ]),
    )
  })
})
