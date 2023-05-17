import {  getPost } from '../../@types/types'
import { PostsRepository } from '../../repositories/posts-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'

interface GetPostUseCaseRequest {
    postId: string
}

interface GetPostUseCaseResponse {
  post: getPost
}

export class GetPostUseCase {
  constructor(private postsRepository: PostsRepository) {}

  async execute({postId}:GetPostUseCaseRequest): Promise<GetPostUseCaseResponse> {
    
    const postExists = await this.postsRepository.findById(postId)

    if(!postExists){
        throw new ResourceNotFoundError()
    }

    const post = await this.postsRepository.getPost(postId)

    if(!post){
        throw new ResourceNotFoundError()
    }

    return {
        post,
    }
  }
}
