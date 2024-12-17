//usecase:add_user.ts

import { Either, Left, Right } from 'purify-ts';
import { User } from '../entities/user';
import { UserDTO } from '../entities/dtos/user_dto';
import { RepositoryInterface } from '../repos/repository_interface'
import { UserCreationError } from '../errors/user_creation_error';

export class AddUser {

  constructor(private userRepository: UserRepository) {


  }

  async execute(userData: UserDTO): Promise<Either<UserCreationError, User>> {
    const userOrError = User.create(userData);

    if (userOrError.isLeft()) return userOrError;

    const userToAdd: User = userOrError.extract() as User;

    // Não pode haver usuário duplicado (e-mail)
    const existingUser: Either<UserCreationError, User> =
      await this.userRepository.findByEmail(userToAdd.email.address);
    if (existingUser.isRight()) {
      return Left(new UserCreationError('Email already in use'));
    }

    await this.userRepository.add(userToAdd);

    return Right(userToAdd);
  }
}
