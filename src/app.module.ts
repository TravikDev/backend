import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';

// Configurations
// import databaseConfig from './config/database.config';
// import configuration from './config/configuration';

@Module({
  imports: [ConfigModule.forRoot({

    validationSchema: Joi.object({
      POSTGRES_HOST: Joi.string().required(),
      POSTGRES_PORT: Joi.number().required(),
      POSTGRES_USER: Joi.string().required(),
      POSTGRES_PASSWORD: Joi.string().required(),
      POSTGRES_DB: Joi.string().required(),
    }),

    // --- Configurations
    // load: [configuration],
    // load: [databaseConfig],

    // --- Options
    // ignoreEnvFile: true,
    // isGlobal: true,
    // cache: true,

    // envFilePath: ['.env.development.local', '.env.development'],
  }),
  DatabaseModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    useFactory: (configService: ConfigService) => ({
      host: configService.get('POSTGRES_HOST'),
      port: configService.get('POSTGRES_PORT'),
      user: configService.get('POSTGRES_USER'),
      password: configService.get('POSTGRES_PASSWORD'),
      database: configService.get('POSTGRES_DB'),
    }),
  }),
    ArticlesModule,
    // DatabaseModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule { }
