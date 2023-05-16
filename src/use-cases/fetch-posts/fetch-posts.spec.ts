import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { FetchPostsUseCase } from './fetch-posts'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'

let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let likeDislikeRepository: InMemoryLikeDislikeRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let commentsRepository: InMemoryCommentsRepository
let sut: FetchPostsUseCase

describe('Fetch Posts Use Case', () => {
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
    sut = new FetchPostsUseCase(postsRepository)
  })

  it('should be able to fetch posts', async () => {
    const user = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: user.id,
    })

    const anotherPost = await postsRepository.create({
      content: 'another-content',
      creator_id: user.id,
    })

    await commentsRepository.create({
      content: 'some comment',
      creator_id: user.id,
      post_id: post.id,
    })

    await commentsRepository.create({
      content: 'another comment',
      creator_id: user.id,
      post_id: anotherPost.id,
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
          comments: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              creatorId: expect.any(String),
              likes: expect.any(Number),
              dislikes: expect.any(Number),
              createdAt: expect.any(String),
              updatedAt: expect.any(String),
            }),
          ]),
        }),
      ]),
    )
  })
})
