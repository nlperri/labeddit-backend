import { Route, Get, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'
import { FetchPostsWithCommentsOutput } from '../../../@types/types'
import { FetchPostsWihCommentsUseCase } from '../../../use-cases/fetch-posts-with-comments/fetch-posts-with-comments'

@Route('postscomments')
export class FetchPostsWithCommentsController {
  constructor(
    private fetchPostsWithCommentsUseCase: FetchPostsWihCommentsUseCase,
  ) {}
  @SuccessResponse('200', 'Success')
  @Get()
  async execute(): Promise<HttpResponse<FetchPostsWithCommentsOutput[]>> {
    const { posts } = await this.fetchPostsWithCommentsUseCase.execute()

    return new HttpResponse<FetchPostsWithCommentsOutput[]>(posts, 200)
  }
}
