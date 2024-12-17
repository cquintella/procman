//domain:user.ts

import { v4 as uuidv4 } from 'uuid';
import { UserCreationError } from '../errors/user_creation_error';
import { Email } from './email';
import { Either, Left, Right } from 'purify-ts';
import { Password } from './password';
import { UserDTO } from './dtos/user_dto';

export class User {
  readonly #id: string;
  #name: string;
  #email: Email;
  #password: Password;

  private constructor(id: string, name: string, email: Email, password: Password) {
    this.#id = id;
    this.#name = name;
    this.#email = email;
    this.#password = password;
  }

  static create(userData: UserDTO): Either<UserCreationError, User> {

    const emailOrError: Either<Error, Email> = Email.create(userData.email);
    if (emailOrError.isLeft()) {
      return Left(
        new UserCreationError(
          `Invalid e-mail: (${emailOrError.extract()})`
        )
      );
    }

    const passwordOrError = Password.create(userData.password);
    if (passwordOrError.isLeft()) {
      return Left(
        new UserCreationError(
          `Invalid Password: (${passwordOrError.extract()})`
        )
      );
    }

    return Right(
      new User(userData.id || uuidv4(), userData.name, emailOrError.extract() as Email, passwordOrError.extract() as Password)
    );
  }

  public get id(): string {
    return this.#id;
  }

  public get name(): string {
    return this.#name;
  }

  get email(): Email {
    return this.#email;
  }

  public get password(): Password {
    return this.#password;
  }

  public set email(email: Email) {
    this.#email = email;
  }

  public set password(password: Password) {
    this.#password = password;
  }


  /* Eu não vejo necessidade disso

  public updateEmail(email: Email): Either<Error, void> {
    // Add business logic for updating email if needed
    this.#email = email;
    return Right(undefined);
  }

  public updatePassword(password: Password): Either<Error, void> {
    // Add business logic for updating password if needed
    this.#password = password;
    return Right(undefined);
  }
*/
}
