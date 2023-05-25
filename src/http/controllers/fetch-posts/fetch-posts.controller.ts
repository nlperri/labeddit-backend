import { FetchPostsUseCase } from '../../../use-cases/fetch-posts/fetch-posts'
import { Route, Get, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchPostsOutput } from '../../../@types/types'

@Route('posts')
export class FetchPostsController {
  constructor(private fetchPostsUseCase: FetchPostsUseCase) {}
  @SuccessResponse('200', 'Success')
  @Get()
  async execute(): Promise<HttpResponse<FetchPostsOutput[]>> {
    const { posts } = await this.fetchPostsUseCase.execute()

    return new HttpResponse<FetchPostsOutput[]>(posts, 200)
  }
}
