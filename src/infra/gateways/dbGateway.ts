import { Either, Left, Right } from 'purify-ts';
import { StorageGatewayInterface } from './StorageGatewayInterface';


// Precisa ser refatorado para operações de Read, Insert, Update e Delete


export class DbGateway<T> implements StorageGatewayInterface<T> {
  private data: T[] = [];
  
  constructor(private dbConnection: any) {}

  async load(): Promise<Either<Error, T[]>> {
    try {
      // Implement your DB load logic here
      return Right(this.data);
    } catch (error) {
      return Left(new Error(`Failed to load from DB: ${error}`));
    }
  }

  async save(data: T[]): Promise<Either<Error, void>> {
    try {
      this.data = data;
      // Implement your DB save logic here
      return Right(undefined);
    } catch (error) {
      return Left(new Error(`Failed to save to DB: ${error}`));
    }
  }

  async finalize(): Promise<Either<Error, void>> {
    try {
      // Cleanup DB connection if needed
      return Right(undefined);
    } catch (error) {
      return Left(new Error(`Failed to finalize DB connection: ${error}`));
    }
  }
}