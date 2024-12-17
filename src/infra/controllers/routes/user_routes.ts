import { Router, Request, Response } from 'express';
import { UserDTO } from '../../../domain/entities/dtos/user_dto';
import { AddUser } from '../../../domain/use_cases/add_user';

import { User } from '../../../domain/entities/user';
import { UserCreationError } from '../../../domain/errors/user_creation_error';

export const  userRoutes = Router();

userRoutes.get('/user', (request, response) => {
    response.send('Hello world!');
  });

  userRoutes.put('/user', (request, response) => {
    response.send('Hello world!');
  });
 
  userRoutes.post('/user', (request, response) => {
    response.send('Hello world!');
  });


