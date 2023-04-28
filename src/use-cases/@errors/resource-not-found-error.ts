import { BaseError } from './base-error'

export class ResourceNotFoundError extends BaseError {
  constructor(message: string = 'Resource not found') {
    super(409, message)
  }
}
