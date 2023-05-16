import { Route, Get, SuccessResponse, Body } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchCommentsUseCase } from '../../../use-cases/fetch-comments/fetch-comments'
import { FetchCommentsOutput } from '../../../@types/types'
import { z } from 'zod'

interface fetchCommentsRequest {
  requestPostId: string
}

@Route('posts')
export class FetchCommentsController {
  constructor(private fetchCommentsUseCase: FetchCommentsUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get(':id/comments')
  async execute(
    @Body()
    { requestPostId }: fetchCommentsRequest,
  ): Promise<HttpResponse<FetchCommentsOutput[]>> {
    const fetchCommentsInputSchema = z.object({
      postId: z.string(),
    })

    const { postId } = fetchCommentsInputSchema.parse({
      postId: requestPostId,
    })

    const { comments } = await this.fetchCommentsUseCase.execute({ postId })

    return new HttpResponse<FetchCommentsOutput[]>(comments, 200)
  }
}
