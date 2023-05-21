import { UserOutput } from '../../@types/types'
import { PostsRepository } from '../../repositories/posts-repository'
import { UsersRepository } from '../../repositories/users-repository'
import { ResourceNotFoundError } from '../@errors/resource-not-found-error'

interface GetUserUseCaseRequest {
  userId: string
}

interface GetUserUseCaseResponse {
  user: UserOutput
}

export class GetUserUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetUserUseCaseRequest): Promise<GetUserUseCaseResponse> {
    const userResponse = await this.usersRepository.findById(userId)

    if (!userResponse) {
      throw new ResourceNotFoundError()
    }

    const user = {
      id: userResponse.id,
      email: userResponse.email,
      name: userResponse.name,
    }

    return {
      user,
    }
  }
}
