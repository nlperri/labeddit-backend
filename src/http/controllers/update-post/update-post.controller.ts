import { z } from 'zod'
import { Post, TokenPayload, USER_ROLES } from '../../../@types/types'
import { UpdatePostUseCase } from '../../../use-cases/update-post/update-post'
import { Put, Route, Body, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'

interface UpdatePostRequestContent {
  requestContent: string
  requestId: string
  requestUser: TokenPayload
}

@Route('posts')
export class UpdatePostController {
  constructor(private updatePostUseCase: UpdatePostUseCase) {}
  @Put(':id')
  async execute(
    @SuccessResponse('200', 'Success')
    @Body()
    { requestContent, requestId, requestUser }: UpdatePostRequestContent,
  ): Promise<HttpResponse<Post>> {
    const updatePostInputSchema = z.object({
      content: z.string(),
      id: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { id, content, user } = updatePostInputSchema.parse({
      content: requestContent,
      id: requestId,
      user: requestUser,
    })

    const { post } = await this.updatePostUseCase.execute({
      id,
      content,
      user,
    })

    return new HttpResponse<Post>(post, 200)
  }
}
