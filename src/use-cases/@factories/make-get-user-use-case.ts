import { KnexUsersRepository } from '../../repositories/knex/users-knex-repository'
import { GetUserUseCase } from '../get-user/get-user'

export function makeGetUserUseCase() {
  const usersRepository = new KnexUsersRepository()
  const useCase = new GetUserUseCase(usersRepository)

  return useCase
}
