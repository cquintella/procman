//domain: password.ts
import { Either, Left, Right } from 'purify-ts';
import { InvalidPasswordError } from '../errors/invalid_password_error';
import { PasswordCreationError } from '../errors/password_creation_error'; // Corrigido o typo no nome da classe

import * as bcrypt from 'bcrypt';

export class Password {
  readonly #password: string;

  private constructor(password: string) {
    this.#password = password;
  }

  /**
   * Cria uma instância de Password após validar a string.
   * @param password A senha a ser usada.
   * @returns Either<PasswordCreationError, Password>
   */
  static create(password: string): Either<PasswordCreationError, Password> {
    const validationResult = Password.validate(password);
    if (validationResult.isLeft()) {
      return Left(
        new PasswordCreationError(validationResult.extract().message)
      );
    }
    return Right(new Password(bcrypt.hashSync(password, 10)));
  }

  /**
   * Valida a senha de acordo com os critérios definidos.
   * @param password A senha a ser validada.
   * @returns Either<InvalidPasswordError, string>
   */
  static validate(password: string): Either<InvalidPasswordError, string> {
    const issues: string[] = [];

    if (!/[A-Z]/.test(password)) {
      issues.push('A senha deve conter pelo menos uma letra maiúscula.');
    }
    if (!/[a-z]/.test(password)) {
      issues.push('A senha deve conter pelo menos uma letra minúscula.');
    }
    if (!/\d/.test(password)) {
      issues.push('A senha deve conter pelo menos um número.');
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      issues.push('A senha deve conter pelo menos um caractere especial.');
    }
    if (password.length < 6) {
      issues.push('A senha deve ter pelo menos 6 caracteres.');
    }

    if (issues.length > 0) {
      return Left(new InvalidPasswordError(issues.join(' '))); // Retorna todas as mensagens concatenadas
    }

    return Right(password); // Se tudo estiver correto, retorna a senha
  }

  /**
   * Compara a senha em texto plano com a senha criptografada.
   * @param plainPassword A senha em texto plano.
   * @returns boolean
   */
  compare(plainPassword: string): boolean {
    return bcrypt.compareSync(plainPassword, this.#password);
  }
}
