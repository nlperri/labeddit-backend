import {
  LikeDislike,
  LikeDislikeInput,
  LikeDislikePostIdCommentId,
  LikeDislikePostIdCommentIdUserId,
  LikeDislikeUpdate,
  
} from '../@types/types'

export interface likeDislikeRepository {
  create(data: LikeDislikeInput): Promise<void>
  findByIds({
    commentId,
    postId,
    userId,
  }: LikeDislikePostIdCommentIdUserId): Promise<LikeDislike | undefined>
  findById({
    commentId,
    postId,
  }: LikeDislikePostIdCommentId): Promise<LikeDislike | undefined>
  delete({
    commentId,
    postId,
    userId,
  }: LikeDislikePostIdCommentId): Promise<void>
  update({
    commentId,
    postId,
    userId,
    likeOrDislike,
  }: LikeDislikeUpdate): Promise<void>
  isContentPost(contentId: string): Promise<boolean>
}
