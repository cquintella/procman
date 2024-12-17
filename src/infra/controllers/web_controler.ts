import * as Express from 'express';
import { LoggerInterface } from '../adapters/logger_interface';
import {userRoutes} from './routes/user_routes';
import {processRoutes} from './routes/process_routes';

/* Inicializa o servidor Express, configura middlewares gerais, e carrega os controladores de rotas.
*/

export default class WebController {
    private port: number;
    private app: Express.Application;
    private bindInterface: string;
    private server: any; // Instância do servidor
    private logger: LoggerInterface;
    private token: string;

    
    constructor(port: number, bindInt: string, logger: LoggerInterface, token: string) {
        this.port = port;
        this.bindInterface = bindInt;
        this.app = Express.application;
        this.logger = logger;
        this.token=token;
        
        
    }

    public serve(): void {
        this.server = this.app.listen(this.port, this.bindInterface, () => {
            this.logger.logInfo(`Server is running on ${this.bindInterface}:${this.port}`);
        });
        this.configureRoutes();
        this.app.get('/',(request:Express.Request,response:Express.Response):void=>{
            response.status(500).send("Send usage Manual");
        });
        this.app.use(Express.json());
    }

    public finalize(): void {
        if (this.server) {
            this.server.close(() => {
                this.logger.logInfo('HTTP server closed.');
            });
        }
    }

    private configureRoutes(){
        
        this.app.use('api/user', userRoutes);
        this.app.use('api/process', processRoutes);

    }
}


