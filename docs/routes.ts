/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import {
  Controller,
  ValidationService,
  FieldErrors,
  ValidateError,
  TsoaRoute,
  HttpStatusCodeLiteral,
  TsoaResponse,
  fetchMiddlewares,
} from '@tsoa/runtime'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AuthenticateController } from './../src/http/controllers/authenticate/authenticate.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CreatePostController } from './../src/http/controllers/create-post/create-post.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { DeletePostController } from './../src/http/controllers/delete-post/delete-post.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { FetchPostsController } from './../src/http/controllers/fetch-posts/fetch-posts.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LikeDislikePostController } from '../src/http/controllers/like-dislike-post/like-dislike.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RegisterController } from './../src/http/controllers/register/register.controller'
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { UpdatePostController } from './../src/http/controllers/update-post/update-post.controller'
import type { RequestHandler, Router } from 'express'

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
  HttpResponse_string_: {
    dataType: 'refObject',
    properties: {
      payload: { dataType: 'string', required: true },
      statusCode: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  AuthenticateRequestBody: {
    dataType: 'refObject',
    properties: {
      email: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TPost: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        updated_at: {
          dataType: 'union',
          subSchemas: [{ dataType: 'datetime' }, { dataType: 'string' }],
        },
        created_at: {
          dataType: 'union',
          subSchemas: [{ dataType: 'datetime' }, { dataType: 'string' }],
          required: true,
        },
        dislikes: { dataType: 'double' },
        likes: { dataType: 'double' },
        content: { dataType: 'string', required: true },
        creator_id: { dataType: 'string', required: true },
        id: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  HttpResponse_TPost_: {
    dataType: 'refObject',
    properties: {
      payload: { ref: 'TPost', required: true },
      statusCode: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  USER_ROLES: {
    dataType: 'refEnum',
    enums: ['NORMAL', 'ADMIN'],
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  TokenPayload: {
    dataType: 'refObject',
    properties: {
      id: { dataType: 'string', required: true },
      name: { dataType: 'string', required: true },
      role: { ref: 'USER_ROLES', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  CreatePostRequestContent: {
    dataType: 'refObject',
    properties: {
      requestContent: { dataType: 'string', required: true },
      requestUser: { ref: 'TokenPayload', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  DeletePostRequest: {
    dataType: 'refObject',
    properties: {
      requestId: { dataType: 'string', required: true },
      requestUser: { ref: 'TokenPayload', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  FetchPostsOutput: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        creator: {
          dataType: 'nestedObjectLiteral',
          nestedProperties: {
            name: { dataType: 'string', required: true },
            id: { dataType: 'string', required: true },
          },
          required: true,
        },
        updatedAt: { dataType: 'string' },
        createdAt: { dataType: 'string', required: true },
        dislikes: { dataType: 'double', required: true },
        likes: { dataType: 'double', required: true },
        content: { dataType: 'string', required: true },
        id: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'HttpResponse_FetchPostsOutput-Array_': {
    dataType: 'refObject',
    properties: {
      payload: {
        dataType: 'array',
        array: { dataType: 'refAlias', ref: 'FetchPostsOutput' },
        required: true,
      },
      statusCode: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  LikeDislikePostRequest: {
    dataType: 'refObject',
    properties: {
      requestLike: { dataType: 'boolean', required: true },
      requestPostId: { dataType: 'string', required: true },
      requestUser: { ref: 'TokenPayload', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'Pick_User.Exclude_keyofUser.password__': {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        id: { dataType: 'string', required: true },
        name: { dataType: 'string', required: true },
        email: { dataType: 'string', required: true },
        created_at: {
          dataType: 'union',
          subSchemas: [{ dataType: 'datetime' }, { dataType: 'string' }],
          required: true,
        },
        role: { ref: 'USER_ROLES', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'Omit_User.password_': {
    dataType: 'refAlias',
    type: { ref: 'Pick_User.Exclude_keyofUser.password__', validators: {} },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  'HttpResponse_Omit_User.password__': {
    dataType: 'refObject',
    properties: {
      payload: { ref: 'Omit_User.password_', required: true },
      statusCode: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  RegisterRequestBody: {
    dataType: 'refObject',
    properties: {
      name: { dataType: 'string', required: true },
      email: { dataType: 'string', required: true },
      password: { dataType: 'string', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  Post: {
    dataType: 'refAlias',
    type: {
      dataType: 'nestedObjectLiteral',
      nestedProperties: {
        updated_at: {
          dataType: 'union',
          subSchemas: [{ dataType: 'datetime' }, { dataType: 'string' }],
        },
        created_at: {
          dataType: 'union',
          subSchemas: [{ dataType: 'datetime' }, { dataType: 'string' }],
          required: true,
        },
        dislikes: { dataType: 'double' },
        likes: { dataType: 'double' },
        content: { dataType: 'string', required: true },
        creator_id: { dataType: 'string', required: true },
        id: { dataType: 'string', required: true },
      },
      validators: {},
    },
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  HttpResponse_Post_: {
    dataType: 'refObject',
    properties: {
      payload: { ref: 'Post', required: true },
      statusCode: { dataType: 'double', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  UpdatePostRequestContent: {
    dataType: 'refObject',
    properties: {
      requestContent: { dataType: 'string', required: true },
      requestId: { dataType: 'string', required: true },
      requestUser: { ref: 'TokenPayload', required: true },
    },
    additionalProperties: false,
  },
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}
const validationService = new ValidationService(models)

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
  // ###########################################################################################################
  //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
  //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
  // ###########################################################################################################
  app.post(
    '/v1/users/authenticate',
    ...fetchMiddlewares<RequestHandler>(AuthenticateController),
    ...fetchMiddlewares<RequestHandler>(
      AuthenticateController.prototype.execute,
    ),

    function AuthenticateController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        body: {
          in: 'body',
          name: 'body',
          required: true,
          ref: 'AuthenticateRequestBody',
        },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new AuthenticateController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post(
    '/v1/posts',
    ...fetchMiddlewares<RequestHandler>(CreatePostController),
    ...fetchMiddlewares<RequestHandler>(CreatePostController.prototype.execute),

    function CreatePostController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        undefined: {
          in: 'body',
          required: true,
          ref: 'CreatePostRequestContent',
        },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new CreatePostController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.delete(
    '/v1/posts/:id',
    ...fetchMiddlewares<RequestHandler>(DeletePostController),
    ...fetchMiddlewares<RequestHandler>(DeletePostController.prototype.execute),

    function DeletePostController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        undefined: { in: 'body', required: true, ref: 'DeletePostRequest' },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new DeletePostController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.get(
    '/v1/posts',
    ...fetchMiddlewares<RequestHandler>(FetchPostsController),
    ...fetchMiddlewares<RequestHandler>(FetchPostsController.prototype.execute),

    function FetchPostsController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {}

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new FetchPostsController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put(
    '/v1/posts/:id/like',
    ...fetchMiddlewares<RequestHandler>(LikeDislikePostController),
    ...fetchMiddlewares<RequestHandler>(
      LikeDislikePostController.prototype.execute,
    ),

    function LikeDislikePostController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        undefined: {
          in: 'body',
          required: true,
          ref: 'LikeDislikePostRequest',
        },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new LikeDislikePostController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.post(
    '/v1/users/register',
    ...fetchMiddlewares<RequestHandler>(RegisterController),
    ...fetchMiddlewares<RequestHandler>(RegisterController.prototype.execute),

    function RegisterController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        body: {
          in: 'body',
          name: 'body',
          required: true,
          ref: 'RegisterRequestBody',
        },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new RegisterController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, 201, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
  app.put(
    '/v1/posts/:id',
    ...fetchMiddlewares<RequestHandler>(UpdatePostController),
    ...fetchMiddlewares<RequestHandler>(UpdatePostController.prototype.execute),

    function UpdatePostController_execute(
      request: any,
      response: any,
      next: any,
    ) {
      const args = {
        undefined: {
          in: 'body',
          required: true,
          ref: 'UpdatePostRequestContent',
        },
      }

      // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

      let validatedArgs: any[] = []
      try {
        validatedArgs = getValidatedArgs(args, request, response)

        const controller = new UpdatePostController()

        const promise = controller.execute.apply(
          controller,
          validatedArgs as any,
        )
        promiseHandler(controller, promise, response, undefined, next)
      } catch (err) {
        return next(err)
      }
    },
  )
  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function isController(object: any): object is Controller {
    return (
      'getHeaders' in object && 'getStatus' in object && 'setStatus' in object
    )
  }

  function promiseHandler(
    controllerObj: any,
    promise: any,
    response: any,
    successStatus: any,
    next: any,
  ) {
    return Promise.resolve(promise)
      .then((data: any) => {
        let statusCode = successStatus
        let headers
        if (isController(controllerObj)) {
          headers = controllerObj.getHeaders()
          statusCode = controllerObj.getStatus() || statusCode
        }

        // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

        returnHandler(response, statusCode, data, headers)
      })
      .catch((error: any) => next(error))
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function returnHandler(
    response: any,
    statusCode?: number,
    data?: any,
    headers: any = {},
  ) {
    if (response.headersSent) {
      return
    }
    Object.keys(headers).forEach((name: string) => {
      response.set(name, headers[name])
    })
    if (
      data &&
      typeof data.pipe === 'function' &&
      data.readable &&
      typeof data._read === 'function'
    ) {
      response.status(statusCode || 200)
      data.pipe(response)
    } else if (data !== null && data !== undefined) {
      response.status(statusCode || 200).json(data)
    } else {
      response.status(statusCode || 204).end()
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function responder(
    response: any,
  ): TsoaResponse<HttpStatusCodeLiteral, unknown> {
    return function (status, data, headers) {
      returnHandler(response, status, data, headers)
    }
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

  function getValidatedArgs(args: any, request: any, response: any): any[] {
    const fieldErrors: FieldErrors = {}
    const values = Object.keys(args).map((key) => {
      const name = args[key].name
      switch (args[key].in) {
        case 'request':
          return request
        case 'query':
          return validationService.ValidateParam(
            args[key],
            request.query[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'queries':
          return validationService.ValidateParam(
            args[key],
            request.query,
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'path':
          return validationService.ValidateParam(
            args[key],
            request.params[name],
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'header':
          return validationService.ValidateParam(
            args[key],
            request.header(name),
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'body':
          return validationService.ValidateParam(
            args[key],
            request.body,
            name,
            fieldErrors,
            undefined,
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'body-prop':
          return validationService.ValidateParam(
            args[key],
            request.body[name],
            name,
            fieldErrors,
            'body.',
            { noImplicitAdditionalProperties: 'throw-on-extras' },
          )
        case 'formData':
          if (args[key].dataType === 'file') {
            return validationService.ValidateParam(
              args[key],
              request.file,
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: 'throw-on-extras' },
            )
          } else if (
            args[key].dataType === 'array' &&
            args[key].array.dataType === 'file'
          ) {
            return validationService.ValidateParam(
              args[key],
              request.files,
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: 'throw-on-extras' },
            )
          } else {
            return validationService.ValidateParam(
              args[key],
              request.body[name],
              name,
              fieldErrors,
              undefined,
              { noImplicitAdditionalProperties: 'throw-on-extras' },
            )
          }
        case 'res':
          return responder(response)
      }
    })

    if (Object.keys(fieldErrors).length > 0) {
      throw new ValidateError(fieldErrors, '')
    }
    return values
  }

  // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
