import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { ConfigInterface } from './config_interface';

export class ConfigGateway {
  private config: ConfigInterface;

  constructor() {
    
    dotenv.config();
    const configFilePath = path.resolve(__dirname, 'config.json');
    this.config = this.loadConfig(configFilePath);
  }

  async private loadConfig(configFile: string): Promise<ConfigInterface,ReadFileError> {
    const data = fs.readFileSync(configFile, 'utf-8');
    const jsonData: ConfigInterface = JSON.parse(data);
    return jsonData;
  }

  public getPort(): number {
    return this.config.port;
  }

  public getBindInt(): string {
    return this.config.bindInt;
  }

  public getUserRepoFile(): string {
    return this.config.userRepoFile;
  }

  public getProcessRepoFile(): string {
    return this.config.processRepoFile;
  }

  public getLogDir(): string {
    return this.config.logDir;
  }

  public getTokenSecret(): string {
    return process.env.TOKEN_SECRET??"defaul-insecure-token";
    // ou usar require('crypto').randomBytes(64).toString('hex')
  }

  public getTokenExpiration():string{
    return process.env.TOKEN_EXPIRATION??"1000s";
  }

  public getCertificate():string{

  }
  public getPrivateKey():string{

  }

}
