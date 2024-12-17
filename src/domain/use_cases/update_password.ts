//ChangeUserPassword

// esse objeto implementa o use case trocar senha
// ele tem um metodo execute que recebe um email de usuário e uma senha
// o execute primeiro converte o email apra o tipo email, para validalo
// se o email for invalido retorna erro de email invalido
//se o email for valido, buscar no reposotorio se existe um usuario com esse email usnado findByemail(Email)
// Se nao existir retornar UserNotFoundError
// Caso existe fazer update do usuario retornado por findByEmail(),
//gravando em .password o hash da senha informada.

import { UsersRepositoryInterface } from '../repos/user_repository_interface.js';
import { User } from '../entities/user';
import { EitherAsync } from 'purify-ts/EitherAsync';
import { Either, Right, Left } from 'purify-ts';
import { Email } from '../entities/email';
import { InvalidEmailError } from '../errors/invalid_email_error';
import { Password } from '../entities/password';
import { InvalidPasswordError } from '../errors/invalid_password_error';
import { UserNotFoundError } from '../errors/user_not_found_error';

export class ChangeUserPassword {
  private userRepo: UsersRepositoryInterface;

  constructor(userRepo: UsersRepositoryInterface) {
    this.userRepo = userRepo;
  }

  public async execute(
    email: string,
    newPassword: string
  ): Promise<Either<Error, void>> {
    const emailOrError: Either<InvalidEmailError, Email> = Email.create(email);
    // Vamos ver se e-mail está em formato válido.
    if (emailOrError.isLeft()) return Promise.resolve(emailOrError);

    //Vamos ver se o e-mail existe no Repo
    const userToChangeOrError = await this.userRepo
      .findByEmail(emailOrError.extract() as Email)
      .run();
    if (userToChangeOrError.isLeft()) return Left(new UserNotFoundError(email));

    const passwordOrError: Either<InvalidPasswordError, Password> =
      Password.create(newPassword);
    if (passwordOrError.isLeft()) return Promise.resolve(passwordOrError);
    const user = userToChangeOrError.extract() as User;
    user.setPassword(passwordOrError.extract() as Password);
    await this.userRepo.update(user);
    return Promise.resolve(Right(void 0));
  }
}
