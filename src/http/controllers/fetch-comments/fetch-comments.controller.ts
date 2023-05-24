import { Route, Get, SuccessResponse, Path } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchCommentsUseCase } from '../../../use-cases/fetch-comments/fetch-comments'
import { FetchCommentsOutput } from '../../../@types/types'
import { z } from 'zod'

@Route('posts')
export class FetchCommentsController {
  constructor(private fetchCommentsUseCase: FetchCommentsUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get(':id/comments')
  async execute(
    @Path()
    id: string,
  ): Promise<HttpResponse<FetchCommentsOutput[]>> {
    const fetchCommentsInputSchema = z.object({
      postId: z.string(),
    })

    const { postId } = fetchCommentsInputSchema.parse({
      postId: id,
    })

    const { comments } = await this.fetchCommentsUseCase.execute({ postId })

    return new HttpResponse<FetchCommentsOutput[]>(comments, 200)
  }
}
