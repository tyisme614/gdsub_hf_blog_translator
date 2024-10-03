import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { WsAdapter } from '@nestjs/platform-ws';
import { join } from 'path';
import * as openai_worker from "./../../openai_worker";
import {ValidationPipe} from "@nestjs/common";
import {EventsGateway} from "./events/events.gateway";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  app.setViewEngine('hbs');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({
    transform: true
  }));
  await app.listen(3000);
  _initializeWorker(app);
}
bootstrap();


/**
 *
 *
 * local functions
 *
 *
 */

function _initializeWorker(app){
  let event_gateway = app.get(EventsGateway);
  openai_worker.initialize_config(event_gateway);
}
