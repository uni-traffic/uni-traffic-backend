export class BadRequest extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BadRequest";
  }
}

export class ForbiddenError extends Error {
  constructor() {
    super();
    this.message = "You do not have permission to access this resource.";
    this.name = "ForbiddenError";
  }
}

export class UnauthorizedError extends Error {
  constructor() {
    super();
    this.message = "Authentication is required to access this resource.";
    this.name = "UnauthorizedError";
  }
}

export class UnexpectedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnexpectedError";
  }
}

export class NotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotFoundError";
  }
}
