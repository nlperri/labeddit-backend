import {
  LikeDislike,
  LikeDislikeInput,
  likeDislikePostIdCommentId,
  likeDislikePostIdCommentIdUserId,
  likeDislikeUpdate,
} from '../@types/types'

export interface likeDislikeRepository {
  create(data: LikeDislikeInput): Promise<void>
  findByIds({
    commentId,
    postId,
    userId,
  }: likeDislikePostIdCommentIdUserId): Promise<LikeDislike | undefined>
  findById({
    commentId,
    postId,
  }: likeDislikePostIdCommentId): Promise<LikeDislike | undefined>
  delete({
    commentId,
    postId,
    userId,
  }: likeDislikePostIdCommentId): Promise<void>
  update({
    commentId,
    postId,
    userId,
    likeOrDislike,
  }: likeDislikeUpdate): Promise<void>
  isContentPost(contentId: string): Promise<boolean>
}
