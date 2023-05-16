export type User = {
  id: string
  name: string
  email: string
  password: string
  created_at: Date | string
  role: USER_ROLES
}

export enum USER_ROLES {
  NORMAL = 'NORMAL',
  ADMIN = 'ADMIN',
}

export interface TokenPayload {
  id: string
  name: string
  role: USER_ROLES
}

export type Post = {
  id: string
  creator_id: string
  content: string
  likes?: number
  dislikes?: number
  created_at: Date | string
  updated_at?: Date | string
}

export type Comment = {
  id: string
  creator_id: string
  post_id: string
  content: string
  likes?: number
  dislikes?: number
  created_at: Date | string
  updated_at?: Date | string
}

export type CommentOutput = {
  id: string
  creatorId: string
  content: string
  likes: number
  dislikes: number
  createdAt: string
  updatedAt: string
}

export type LikeDislike = {
  user_id: string
  content_id: string
  like: number
}

export type UserCreateInput = {
  id?: string
  name: string
  email: string
  password_hash: string
  created_at?: Date | string
  role?: USER_ROLES
}

export type PostCreateInput = {
  creator_id: string
  content: string
}

export type PostEditInput = {
  id: string
  content: string
}

export type CommentCreateInput = {
  creator_id: string
  content: string
  post_id: string
}

export type CommentCreateInputDTO = {
  comment_id: string
}

export type PostCreateInputDTO = {
  post_id: string
}

export type CommentEditInput = {
  id: string
  content: string
}

export type PostEditInputDTO = {
  id: string
  content: string
  post: Post
}

export type CommentEditInputDTO = {
  id: string
  content: string
  comment: Comment
}

export type FetchPostsOutput = {
  id: string
  content: string
  likes: number
  dislikes: number
  createdAt: string
  updatedAt?: string
  creator: {
    id: string
    name: string
  }
  comments: CommentOutput[]
}

export type FetchPostsCommentsOutput = {
  id: string
  postId: string
  content: string
  likes: number
  dislikes: number
  createdAt: string
  updatedAt?: string
  creator: {
    id: string
    name: string
  }
}

export type LikeDislikeInput = {
  userId: string
  contentId: string
  like: boolean
}

export type CommentsPosts = {
  id: string
  comment_id: string
}

export type PostsComments = {
  id: string
  post_id: string
}

export type CommentsPostsTable = {
  id: string
  comment_id?: string
  post_id?: string
}

export type CommentsPostsCreateInput = {
  comment_id?: string
  post_id?: string
}
