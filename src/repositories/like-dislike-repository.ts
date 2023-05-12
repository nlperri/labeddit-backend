import { LikeDislike, LikeDislikeInput } from '../@types/types'

export interface likeDislikeRepository {
  create(data: LikeDislikeInput): Promise<void>
  findByIds(contentId: string, userId: string): Promise<LikeDislike | undefined>
  delete(contentId: string, userId: string): Promise<void>
  update(
    contentId: string,
    userId: string,
    likeOrDislike: number,
  ): Promise<void>
  isContentPost(contentId: string): Promise<boolean>
}
