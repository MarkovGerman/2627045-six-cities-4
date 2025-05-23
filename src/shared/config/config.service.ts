import {config} from 'dotenv';
import { LoggerInterface } from '../logger/logger.interface.js';
import { ConfigInterface } from './config.interface.js';
import {inject, injectable} from 'inversify';
import { configRestSchema, RestSchema } from './rest.shema.js';
import { AppComponent } from '../types/app-component.enum.js';

@injectable()
export default class ConfigService implements ConfigInterface<RestSchema> {
  private readonly config: RestSchema;

  constructor(@inject(AppComponent.LoggerInterface) private readonly logger: LoggerInterface) {
    const parsedOutput = config();
    if (parsedOutput.error) {
      throw new Error('Can\'t read .env file');
    }
    configRestSchema.load({});
    configRestSchema.validate({allowed: 'strict', output: this.logger.info});
    this.config = configRestSchema.getProperties();
    this.logger.info('.env file found and successfully parsed');
  }

  public get<T extends keyof RestSchema>(key: T): RestSchema[T] {
    return this.config[key];
  }
}
