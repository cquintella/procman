//usecase: list_users.ts

import { User } from '../entities/user';
import { Either, Left, Right } from 'purify-ts';

import { UsersRepositoryInterface } from '../repos/user_repository_interface';
import { RepositoryError } from '../errors/repository_error';

class ListUsers {
  private userRepository: UsersRepositoryInterface;

  constructor(userRepository: UsersRepositoryInterface) {
    this.userRepository = userRepository;
  }

  public async execute(): Promise<Either<RepositoryError, User[]>> {
    const result: Either<RepositoryError, User[]> =
      await this.userRepository.findAll();
    return result;
  }
}
