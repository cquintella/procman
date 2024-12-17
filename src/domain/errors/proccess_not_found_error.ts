import { RepositoryError } from './repository_error';

export class ProccessNotFoundError extends RepositoryError {
  constructor(process: string) {
    super(`Could not find user "${process}" in the database.`);
    this.name = 'ProcessNotFoundError';
  }
}
