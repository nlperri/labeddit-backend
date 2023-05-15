import { z } from 'zod'
import {
  Comment as TComment,
  TokenPayload,
  USER_ROLES,
} from '../../../@types/types'
import { Post, Route, Body, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { CreateCommentUseCase } from '../../../use-cases/create-comment/create-comment'

interface CreateCommentRequestContent {
  requestContent: string
  requestUser: TokenPayload
  requestPostId: string
}

@Route('posts')
export class CreateCommentController {
  constructor(private createCommentUseCase: CreateCommentUseCase) {}
  @SuccessResponse('201', 'Created')
  @Post(':id/comments')
  async execute(
    @Body()
    { requestContent, requestUser, requestPostId }: CreateCommentRequestContent,
  ): Promise<HttpResponse<TComment>> {
    const createCommentInputSchema = z.object({
      content: z.string(),
      postId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { content, user, postId } = createCommentInputSchema.parse({
      content: requestContent,
      user: requestUser,
      postId: requestPostId,
    })

    const { comment } = await this.createCommentUseCase.execute({
      content,
      userId: user.id,
      postId,
    })

    return new HttpResponse<TComment>(comment, 201)
  }
}
