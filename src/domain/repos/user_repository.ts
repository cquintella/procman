
import { Either, Left, Right} from 'purify-ts'; 
import {User} from "../entities/user"
import { Email } from "../entities/email";
import { RepositoryError } from "../errors/repository_error";

export class UserRepository {
    
    private list: User[];

    constructor(){
        this.list=[];

    }

    public add(user: User) : Either<RepositoryError,void>{
        try{
            this.list.push(user);
        }
        catch(error:any){
            return (Left(new RepositoryError(error.message)));
        }
        return (Right(undefined));
    }

    findById(id: string): Either<RepositoryError,User>{
    

    }
    findAll(): Promise<User[]>{}
    update(entity: T): Promise<User>{}
    deleteById(id: string): Promise<void>{}
    findByEmail(emai:Email):Promise<User>{}

}