import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { ArticlesModule } from './articles/articles.module';
import Joi from 'joi';

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

    // envFilePath: ['.env.development.local', '.env.development'],

    // --- Options
    // ignoreEnvFile: true,
    // isGlobal: true,
    // cache: true,

  }),
    ArticlesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
