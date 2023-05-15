import { z } from 'zod'
import { Comment, TokenPayload, USER_ROLES } from '../../../@types/types'
import { Put, Route, Body, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { UpdateCommentUseCase } from '../../../use-cases/update-comment/update-comment'

interface UpdateCommentRequestContent {
  requestContent: string
  requestCommentId: string
  requestUser: TokenPayload
}

@Route('comments')
export class UpdateCommentController {
  constructor(private updateCommentUseCase: UpdateCommentUseCase) {}
  @Put(':id')
  async execute(
    @SuccessResponse('200', 'Success')
    @Body()
    {
      requestContent,
      requestCommentId,
      requestUser,
    }: UpdateCommentRequestContent,
  ): Promise<HttpResponse<Comment>> {
    const updateCommentInputSchema = z.object({
      content: z.string(),
      commentId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { commentId, content, user } = updateCommentInputSchema.parse({
      content: requestContent,
      commentId: requestCommentId,
      user: requestUser,
    })

    const { comment } = await this.updateCommentUseCase.execute({
      commentId,
      content,
      userId: user.id,
    })

    return new HttpResponse<Comment>(comment, 200)
  }
}
