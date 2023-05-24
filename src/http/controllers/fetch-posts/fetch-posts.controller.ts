import { FetchPostsUseCase } from '../../../use-cases/fetch-posts/fetch-posts'
import { Route, Get, SuccessResponse, Body } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchPostsOutput } from '../../../@types/types'
import { z } from 'zod'

interface FetchPostsControllerRequest {
  requestPage: string
}

@Route('posts')
export class FetchPostsController {
  constructor(private fetchPostsUseCase: FetchPostsUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get('page/:page')
  async execute(
    @Body()
    { requestPage }: FetchPostsControllerRequest,
  ): Promise<HttpResponse<FetchPostsOutput[]>> {
    const fetchPostsInputSchema = z.object({
      page: z.coerce.number(),
    })

    const { page } = fetchPostsInputSchema.parse({
      page: requestPage,
    })

    const { posts } = await this.fetchPostsUseCase.execute({ page })

    return new HttpResponse<FetchPostsOutput[]>(posts, 200)
  }
}
