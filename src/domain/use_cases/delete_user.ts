//usecase: delete_user.ts

import { UserNotFoundError } from '../errors/user_not_found_error';
import { Either, Left, Right } from 'purify-ts';
import { UsersRepositoryInterface } from '../repos/user_repository_interface';

class DeleteUser {
  public async execute(
    userId: string
  ): Promise<Either<UserNotFoundError, void>> {
    //Check if user exists

    return undefined;
  }
}
