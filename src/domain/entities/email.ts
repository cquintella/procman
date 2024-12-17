//domain:email.ts
import { Either, Left, Right } from 'purify-ts/Either';
import { InvalidEmailError } from '../errors/invalid_email_error';

export class Email {
  readonly #address: string;

  private constructor(address: string) {
    this.#address = address; // Aqui já assumimos que o endereço está validado
  }

  /**
   * Valida o endereço de e-mail.
   * @param email O endereço de e-mail a ser validado.
   * @returns Either<InvalidEmailError, string>
   */

  static validate(email: string): Either<InvalidEmailError, string> {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!pattern.test(email)) {
      return Left(new InvalidEmailError(`E-mail inválido: ${email}`));
    }
    return Right(email); // Se for válido, retorna o próprio endereço
  }

  /**
   * Cria uma instância de Email após validar o endereço.
   * @param address O endereço de e-mail a ser usado.
   * @returns Either<InvalidEmailError, Email>
   */
  static create(address: string): Either<InvalidEmailError, Email> {
    
    const isValidEmail = this.validate(address);

    if (isValidEmail.isRight()) {
      return Right(new Email(address));
    }

    // Se não for, deve retornar InvalidEmailError informando que o formato em address não é válido
    return Left(new InvalidEmailError(`the value provided for e-mail is invalid: ${address}`));
  }

  /**
   * Retorna o endereço de e-mail.
   * @returns string
   */
  get address(): string {
    return this.#address;
  }
}
