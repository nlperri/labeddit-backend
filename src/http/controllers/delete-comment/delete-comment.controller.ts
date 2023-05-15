import { z } from 'zod'
import { TokenPayload, USER_ROLES } from '../../../@types/types'
import { Route, Body, Delete, SuccessResponse } from 'tsoa'
import { DeleteCommentUseCase } from '../../../use-cases/delete-comment/delete-comment'

interface DeleteCommentRequest {
  requestId: string
  requestUser: TokenPayload
}

@Route('comments')
export class DeleteCommentController {
  constructor(private deleteCommentUseCase: DeleteCommentUseCase) {}
  @SuccessResponse('200', 'Success')
  @Delete(':id')
  async execute(
    @Body()
    { requestId, requestUser }: DeleteCommentRequest,
  ): Promise<void> {
    const deleteCommentInputSchema = z.object({
      id: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { id, user } = deleteCommentInputSchema.parse({
      id: requestId,
      user: requestUser,
    })

    await this.deleteCommentUseCase.execute({
      id,
      user,
    })
  }
}
