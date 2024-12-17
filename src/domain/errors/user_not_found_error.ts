import { RepositoryError } from './repository_error';

export class UserNotFoundError extends RepositoryError {
  constructor(user: string) {
    super(`Could not find user "${user}" in the database.`);
    this.name = 'UserNotFoundError';
  }
}
