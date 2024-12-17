//domain: invalid_password_error.ts

/**
 * Error class for Invalid Password
 * 
 */

export class InvalidPasswordError extends Error {

    constructor(message: string) {
      super(message);
      this.name = 'InvalidPasswordError';
    }
  }