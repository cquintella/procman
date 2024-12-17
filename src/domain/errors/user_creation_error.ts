
export class UserCreationError extends Error {
    constructor(message : string = "User Creation Error!") {
      super(message);
      this.name = 'UserCreationError';
    }
  }