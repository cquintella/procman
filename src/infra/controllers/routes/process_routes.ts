//process_routes.ts


import { Router, Request, Response } from 'express';
import { Process } from '../../../domain/entities/process';
import { ProcessDTO } from '../../../domain/entities/dtos/process_dto';


export const processRoutes = Router();


processRoutes.get((req:Request, res:Response)=>{
    res.send('get');
})



