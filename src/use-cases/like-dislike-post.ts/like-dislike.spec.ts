import { expect, describe, it, beforeEach } from 'vitest'
import { InMemoryPostsRepository } from '../../repositories/in-memory/in-memory-posts-repository'
import { InMemoryUsersRepository } from '../../repositories/in-memory/in-memory-users-repository'
import { InMemoryLikeDislikeRepository } from '../../repositories/in-memory/in-memory-like-dislike-repository'
import { LikeDislikeUseCase } from './like-dislike'
import { InMemoryCommentsRepository } from '../../repositories/in-memory/in-memory-comments-repository'
import { InMemoryCommentsPostsRepository } from '../../repositories/in-memory/in-memory-comments-posts-repository'

let likeDislikeRepository: InMemoryLikeDislikeRepository
let postsRepository: InMemoryPostsRepository
let usersRepository: InMemoryUsersRepository
let commentsRepository: InMemoryCommentsRepository
let commentsPostsRepository: InMemoryCommentsPostsRepository
let sut: LikeDislikeUseCase

describe('Like Dislike Use Case', () => {
  beforeEach(() => {
    commentsPostsRepository = new InMemoryCommentsPostsRepository()
    likeDislikeRepository = new InMemoryLikeDislikeRepository(
      commentsPostsRepository,
    )
    usersRepository = new InMemoryUsersRepository()
    postsRepository = new InMemoryPostsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    commentsRepository = new InMemoryCommentsRepository(
      usersRepository,
      commentsPostsRepository,
    )
    sut = new LikeDislikeUseCase(
      likeDislikeRepository,
      postsRepository,
      usersRepository,
      commentsRepository,
    )
  })

  it('should be able to like a post that is not already liked or disliked by the user', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: true,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content_id: post.id,
          user_id: user.id,
          like: 1,
        }),
      ]),
    )

    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          likes: 1,
          dislikes: undefined,
        }),
      ]),
    )
  })

  it('should be able to dislike a post that is not already disliked or liked by the user', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: false,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content_id: post.id,
          user_id: user.id,
          like: 2,
        }),
      ]),
    )

    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dislikes: 1,
          likes: undefined,
        }),
      ]),
    )
  })

  it('should remove like if user likes a post that is already liked', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: true,
      contentId: post.id,
      userId: user.id,
    })

    await sut.execute({
      like: true,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toHaveLength(0)
    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dislikes: undefined,
          likes: undefined,
        }),
      ]),
    )
  })

  it('should remove dislike if user dislikes a post that is already disliked', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: false,
      contentId: post.id,
      userId: user.id,
    })

    await sut.execute({
      like: false,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toHaveLength(0)
    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dislikes: undefined,
          likes: undefined,
        }),
      ]),
    )
  })

  it('should be able to user likes a post that is disliked and remove dislike', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: false,
      contentId: post.id,
      userId: user.id,
    })

    await sut.execute({
      like: true,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content_id: post.id,
          user_id: user.id,
          like: 1,
        }),
      ]),
    )

    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dislikes: undefined,
          likes: 1,
        }),
      ]),
    )
  })

  it('should be able to user dislikes a post that is liked and remove like', async () => {
    const userWithPost = await usersRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: '123456',
    })

    const user = await usersRepository.create({
      name: 'Natalia Perri',
      email: 'natalia@example.com',
      password_hash: '123456',
    })

    const post = await postsRepository.create({
      content: 'some-content',
      creator_id: userWithPost.id,
    })

    await sut.execute({
      like: true,
      contentId: post.id,
      userId: user.id,
    })

    await sut.execute({
      like: false,
      contentId: post.id,
      userId: user.id,
    })

    expect(likeDislikeRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          content_id: post.id,
          user_id: user.id,
          like: 2,
        }),
      ]),
    )

    expect(postsRepository.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          dislikes: 1,
          likes: undefined,
        }),
      ]),
    )
  })
})
