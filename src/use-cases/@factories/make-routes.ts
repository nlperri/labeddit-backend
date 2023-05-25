import { AuthenticateController } from '../../http/controllers/authenticate/authenticate.controller'
import { CreatePostController } from '../../http/controllers/create-post/create-post.controller'
import { UpdatePostController } from '../../http/controllers/update-post/update-post.controller'
import { FetchPostsController } from '../../http/controllers/fetch-posts/fetch-posts.controller'
import { RegisterController } from '../../http/controllers/register/register.controller'
import { TokenManager } from '../../http/token-manager'
import { makeAuthenticateUseCase } from './make-authenticate-use-case'
import { makeCreatePostUseCase } from './make-create-post-use-case'
import { makeFetchPostsUseCase } from './make-fetch-posts-use-case'
import { makeRegisterUseCase } from './make-register-use-case'
import { makeUpdatePostUseCase } from './make-update-post-use-case'
import { makeDeletePostUseCase } from './make-delete-post-use-case'
import { DeletePostController } from '../../http/controllers/delete-post/delete-post.controller'
import { makeLikeDislikeUseCase } from './make-like-dislike-post'
import { LikeDislikeController } from '../../http/controllers/like-dislike-post/like-dislike.controller'
import { makeCreateCommentUseCase } from './make-create-comment'
import { makeUpdateCommentUseCase } from './make-update-comment'
import { makeDeleteCommentUseCase } from './make-delete-comment'
import { CreateCommentController } from '../../http/controllers/create-comment/create-comment.controller'
import { UpdateCommentController } from '../../http/controllers/update-comment/update-comment.controller'
import { DeleteCommentController } from '../../http/controllers/delete-comment/delete-comment.controller'
import { makeFetchCommentsUseCase } from './make-fetch-comments-use-case'
import { FetchCommentsController } from '../../http/controllers/fetch-comments/fetch-comments.controller'
import { makeGetPostUseCase } from './make-get-post-use-case'
import { GetPostController } from '../../http/controllers/get-post/get-post.controller'
import { makeGetUserUseCase } from './make-get-user-use-case'
import { GetUserController } from '../../http/controllers/get-user/get-user.controller'
import { makeFetchPostsWithCommentsUseCase } from './make-fetch-posts-with-comments-use-case'
import { FetchPostsWithCommentsController } from '../../http/controllers/fetch-posts-with-comments/fetch-posts-with-comments.controller'

export function makeRoutes() {
  const tokenManager = new TokenManager()
  const registerUseCase = makeRegisterUseCase()
  const authenticateUseCase = makeAuthenticateUseCase()
  const createPostUseCase = makeCreatePostUseCase()
  const fetchPostsUseCase = makeFetchPostsUseCase()
  const updatePostUseCase = makeUpdatePostUseCase()
  const deletePostUseCase = makeDeletePostUseCase()
  const likeDislikePostUseCase = makeLikeDislikeUseCase()
  const authenticate = new AuthenticateController(
    tokenManager,
    authenticateUseCase,
  )
  const createCommentUseCase = makeCreateCommentUseCase()
  const updateCommentUseCase = makeUpdateCommentUseCase()
  const deleteCommentUseCase = makeDeleteCommentUseCase()
  const fetchCommentsUseCase = makeFetchCommentsUseCase()
  const getPostUseCase = makeGetPostUseCase()
  const getUserUseCase = makeGetUserUseCase()
  const fetchPostsWithCommentsUseCase = makeFetchPostsWithCommentsUseCase()

  const register = new RegisterController(registerUseCase, tokenManager)
  const createPost = new CreatePostController(createPostUseCase)
  const fetchPosts = new FetchPostsController(fetchPostsUseCase)
  const updatePosts = new UpdatePostController(updatePostUseCase)
  const deletePosts = new DeletePostController(deletePostUseCase)
  const likeDislike = new LikeDislikeController(likeDislikePostUseCase)
  const createComment = new CreateCommentController(createCommentUseCase)
  const updateComment = new UpdateCommentController(updateCommentUseCase)
  const deleteComment = new DeleteCommentController(deleteCommentUseCase)
  const fetchComments = new FetchCommentsController(fetchCommentsUseCase)
  const getPost = new GetPostController(getPostUseCase)
  const getUser = new GetUserController(getUserUseCase)
  const fetchPostsWithComments = new FetchPostsWithCommentsController(
    fetchPostsWithCommentsUseCase,
  )

  return {
    authenticate,
    register,
    createPost,
    fetchPosts,
    updatePosts,
    deletePosts,
    likeDislike,
    createComment,
    updateComment,
    deleteComment,
    fetchComments,
    getPost,
    getUser,
    fetchPostsWithComments,
  }
}
