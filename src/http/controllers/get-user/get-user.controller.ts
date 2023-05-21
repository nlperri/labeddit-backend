import { Route, Get, SuccessResponse, Body } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { UserOutput } from '../../../@types/types'
import { z } from 'zod'
import { GetUserUseCase } from '../../../use-cases/get-user/get-user'

interface GetUserRequest {
  requestUserId: string
}

@Route('users')
export class GetUserController {
  constructor(private GetUserUseCase: GetUserUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get(':id')
  async execute(
    @Body()
    { requestUserId }: GetUserRequest,
  ): Promise<HttpResponse<UserOutput>> {
    const getUserInputSchema = z.object({
      userId: z.string(),
    })

    const { userId } = getUserInputSchema.parse({
      userId: requestUserId,
    })

    const { user } = await this.GetUserUseCase.execute({ userId })

    return new HttpResponse<UserOutput>(user, 200)
  }
}
