import { z } from 'zod'
import { TokenPayload, USER_ROLES } from '../../../@types/types'
import { LikeDislikePostUseCase } from '../../../use-cases/like-dislike-post.ts/like-dislike'
import { Route, Body, Put, SuccessResponse } from 'tsoa'
import { HttpResponse } from '../../response/response'

interface LikeDislikePostRequest {
  requestLike: boolean
  requestPostId: string
  requestUser: TokenPayload
}

@Route('posts')
export class LikeDislikePostController {
  constructor(private likeDislikePostUseCase: LikeDislikePostUseCase) {}
  @SuccessResponse('200', 'Success')
  @Put(':id/like')
  async execute(
    @Body()
    { requestLike, requestPostId, requestUser }: LikeDislikePostRequest,
  ): Promise<void> {
    const likeDislikePostInputSchema = z.object({
      like: z.boolean(),
      postId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { like, user, postId } = likeDislikePostInputSchema.parse({
      like: requestLike,
      user: requestUser,
      postId: requestPostId,
    })

    await this.likeDislikePostUseCase.execute({
      like,
      postId,
      userId: user.id,
    })
  }
}
