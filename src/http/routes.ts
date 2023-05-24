import { router } from '../app'
import { makeAuthenticationMiddleware } from '../use-cases/@factories/make-authentication-middleware'
import { makeRoutes } from '../use-cases/@factories/make-routes'

const {
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
} = makeRoutes()
const authenticationMiddleware = makeAuthenticationMiddleware()

export async function appRoutes() {
  router.post('/users/register', async (req, res) => {
    const { payload, statusCode } = await register.execute(req.body)
    res.status(statusCode).json(payload)
  })

  router.post('/users/authenticate', async (req, res) => {
    const { payload, statusCode } = await authenticate.execute(req.body)
    res.status(statusCode).json(payload)
  })
  router.post(
    '/posts',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await createPost.execute({
        requestContent: req.body.content,
        requestUser: req.user!,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.get(
    '/posts/page/:page',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await fetchPosts.execute({
        requestPage: req.params.page,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.put(
    '/posts/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await updatePosts.execute({
        requestContent: req.body.content,
        requestId: req.params.id,
        requestUser: req.user!,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.delete(
    '/posts/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      await deletePosts.execute({
        requestId: req.params.id,
        requestUser: req.user!,
      })
      res.status(204).send()
    },
  )
  router.put(
    '/posts/:id/like',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      await likeDislike.execute({
        requestLike: req.body.like,
        requestContentId: req.params.id,
        requestUser: req.user!,
      })
      res.status(204).send()
    },
  )
  router.post(
    '/posts/:id/comments',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await createComment.execute({
        requestContent: req.body.content,
        requestUser: req.user!,
        requestPostId: req.params.id,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.put(
    '/comments/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await updateComment.execute({
        requestContent: req.body.content,
        requestCommentId: req.params.id,
        requestUser: req.user!,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.delete(
    '/comments/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      await deleteComment.execute({
        requestId: req.params.id,
        requestUser: req.user!,
      })
      res.status(204).send()
    },
  )
  router.get(
    '/posts/:id/comments',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await fetchComments.execute({
        requestPostId: req.params.id,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.get(
    '/posts/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await getPost.execute({
        requestPostId: req.params.id,
      })
      res.status(statusCode).json(payload)
    },
  )
  router.get(
    '/users/:id',
    (req, res, next) => authenticationMiddleware.auth(req, res, next),
    async (req, res) => {
      const { payload, statusCode } = await getUser.execute({
        requestUserId: req.params.id,
      })
      res.status(statusCode).json(payload)
    },
  )
}
