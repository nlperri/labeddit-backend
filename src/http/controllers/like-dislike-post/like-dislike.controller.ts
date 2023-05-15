import { z } from 'zod'
import { TokenPayload, USER_ROLES } from '../../../@types/types'
import { Route, Body, Put, SuccessResponse } from 'tsoa'
import { LikeDislikeUseCase } from '../../../use-cases/like-dislike-post.ts/like-dislike'

interface LikeDislikeRequest {
  requestLike: boolean
  requestContentId: string
  requestUser: TokenPayload
}

@Route('posts')
export class LikeDislikeController {
  constructor(private likeDislikeUseCase: LikeDislikeUseCase) {}
  @SuccessResponse('200', 'Success')
  @Put(':id/like')
  async execute(
    @Body()
    { requestLike, requestContentId, requestUser }: LikeDislikeRequest,
  ): Promise<void> {
    const likeDislikeInputSchema = z.object({
      like: z.boolean(),
      contentId: z.string(),
      user: z.object({
        id: z.string(),
        name: z.string(),
        role: z.enum([USER_ROLES.ADMIN, USER_ROLES.NORMAL]),
      }),
    })

    const { like, user, contentId } = likeDislikeInputSchema.parse({
      like: requestLike,
      user: requestUser,
      contentId: requestContentId,
    })

    await this.likeDislikeUseCase.execute({
      like,
      contentId,
      userId: user.id,
    })
  }
}
