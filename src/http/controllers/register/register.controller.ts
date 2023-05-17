import { z } from 'zod'
import { RegisterUseCase } from '../../../use-cases/register/register'
import {
  Body,
  Post,
  Route,
  SuccessResponse,
} from 'tsoa'
import { HttpResponse } from '../../response/response'
import { TokenManager } from '../../token-manager'

interface RegisterRequestBody {
  name: string
  email: string
  password: string
}

@Route('users')
export class RegisterController {
  constructor(private registerUseCase: RegisterUseCase,
    private tokenManager: TokenManager) {}

  @SuccessResponse('201', 'Created')
  @Post('register')
  async execute(
    @Body() body: RegisterRequestBody,
  ): Promise<HttpResponse<string>> {
    const registerBodySchema = z.object({
      name: z.string(),
      email: z.string().email(),
      password: z.string().min(6),
    })
    const { name, email, password } = registerBodySchema.parse(body)
    const { user } = await this.registerUseCase.execute({
      name,
      email,
      password,
    })

    const token = this.tokenManager.createToken({
      id: user.id,
      name: user.name,
      role: user.role,
    })

    return new HttpResponse<string>(token, 201)
  }
}
