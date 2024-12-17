//use_case:update_user.ts

import { UsersRepositoryInterface } from '../repos/user_repository_interface.js';
import { RepositoryError } from '../errors/repository_error';
import { Either, Left, Right } from 'purify-ts';
import { UserNotFoundError } from '../errors/user_not_found_error';
import { User, UserProps } from '../entities/user';

class UpdateUser {
  private repo: UsersRepositoryInterface;

  constructor(userRepo: UsersRepositoryInterface) {
    this.repo = userRepo;
  }
  public async execute(usertoUpdate: User): Promise<Either<Error, void>> {
    // Check User Exists
    const userOrError: Either<UserNotFoundError, User> =
      await this.repo.findById(usertoUpdate.getId());
    if (userOrError.isLeft())
      return Left(new UserNotFoundError('User Not Found'));
    const result: Either<RepositoryError, void> = await this.repo.update(
      usertoUpdate
    );
    if (result.isLeft()) return Left(new RepositoryError('Error Updating'));
    return Right(undefined);
  }
}
