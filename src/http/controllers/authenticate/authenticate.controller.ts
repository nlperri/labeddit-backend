import { z } from 'zod'
import { TokenManager } from '../../token-manager'
import { AuthenticateUseCase } from '../../../use-cases/authenticate/authenticate'
import {
  Post,
 
  Route,
  Body,

  SuccessResponse,
} from 'tsoa'
import { HttpResponse } from '../../response/response'

interface AuthenticateRequestBody {
  email: string
  password: string
}

@Route('users')
export class AuthenticateController {
  constructor(
    private tokenManager: TokenManager,
    private authenticateUseCase: AuthenticateUseCase,
  ) {}

  @Post('authenticate')
  @SuccessResponse('200', 'Success')
  async execute(
    @Body() body: AuthenticateRequestBody,
  ): Promise<HttpResponse<string>> {
    const authenticateBodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    })

    const { email, password } = authenticateBodySchema.parse(body)

    const { user } = await this.authenticateUseCase.execute({
      email,
      password,
    })

    const token = this.tokenManager.createToken({
      id: user.id,
      name: user.name,
      role: user.role,
    })

    return new HttpResponse<string>(token, 200)
  }
}
