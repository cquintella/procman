import { Either } from 'purify-ts';

export interface StorageGatewayInterface<T> {
  insert(item: T): Promise<Either<Error, T>>;
  update(id: string, item: T): Promise<Either<Error, T>>;
  find(id: string): Promise<Either<Error, T | null>>;
  listAll(): Promise<Either<Error, T[]>>;
  delete(id: string): Promise<Either<Error, void>>;
  finalize(): Promise<Either<Error, void>>;
}