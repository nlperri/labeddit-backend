import { Route, Get, SuccessResponse, Path } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchCommentsUseCase } from '../../../use-cases/fetch-comments/fetch-comments'
import { FetchCommentsOutput, GetPost } from '../../../@types/types'
import { z } from 'zod'
import { GetPostUseCase } from '../../../use-cases/get-post/get-post'

@Route('posts')
export class GetPostController {
  constructor(private GetPostUseCase: GetPostUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get(':id')
  async execute(@Path() id: string): Promise<HttpResponse<GetPost>> {
    const getPostInputSchema = z.object({
      postId: z.string(),
    })

    const { postId } = getPostInputSchema.parse({
      postId: id,
    })

    const { post } = await this.GetPostUseCase.execute({ postId })

    return new HttpResponse<GetPost>(post, 200)
  }
}
