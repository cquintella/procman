import { User } from './user';
import { Email } from './email';
import { Password } from './password';
import { UserCreationError } from '../errors/user_creation_error';
import { Left, Right } from 'purify-ts';

// Mock para Email e Password
jest.mock('./email', () => ({
  Email: {
    create: jest.fn(),
  },
}));

jest.mock('./password', () => ({
  Password: {
    create: jest.fn(),
  },
}));

describe('User.create', () => {
  const mockEmailCreate = Email.create as jest.Mock;
  const mockPasswordCreate = Password.create as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar um usuário com sucesso quando email e senha são válidos', () => {
    // Mock retornando Right para Email e Password
    mockEmailCreate.mockReturnValue(Right(new Email('test@example.com')));
    mockPasswordCreate.mockReturnValue(Right(new Password('ValidPassword123!')));

    const result = User.create('John Doe', 'test@example.com', 'ValidPassword123!');

    expect(result.isRight()).toBe(true);
    const user = result.extract();
    expect(user.name).toBe('John Doe');
    expect(user.email).toEqual(new Email('test@example.com'));
    expect(user.password).toEqual(new Password('ValidPassword123!'));
  });

  it('deve falhar ao criar um usuário quando o email é inválido', () => {
    // Mock retornando Left para Email
    mockEmailCreate.mockReturnValue(Left(new Error('Invalid email format')));

    const result = User.create('John Doe', 'invalid-email', 'ValidPassword123!');

    expect(result.isLeft()).toBe(true);
    const error = result.extract();
    expect(error).toBeInstanceOf(UserCreationError);
    expect(error.message).toContain('Error creating user');
  });

  it('deve falhar ao criar um usuário quando a senha é inválida', () => {
    // Mock retornando Right para Email e Left para Password
    mockEmailCreate.mockReturnValue(Right(new Email('test@example.com')));
    mockPasswordCreate.mockReturnValue(Left(new Error('Password is too weak')));

    const result = User.create('John Doe', 'test@example.com', 'weakpass');

    expect(result.isLeft()).toBe(true);
    const error = result.extract();
    expect(error).toBeInstanceOf(UserCreationError);
    expect(error.message).toContain('Error creating user');
  });
});
