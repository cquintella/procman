//domain:repo:repository_interface.ts
import { Either, Left, Right } from "purify-ts";
import { RepositoryError } from "../errors/repository_error";

export interface RepositoryInterface<T> {
    add(entity: T): Either<RepositoryError,null>;
    findById(id: string): Either <RepositoryError,T>;
    findAll(): Either<RepositoryError,T[]>;
    update(entity: T): Either<RepositoryError,T>;
    deleteById(id: string): Either<RepositoryError,void>;
  }