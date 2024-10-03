import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {EventsGateway} from "./events/events.gateway";
import {NestjsFormDataModule} from "nestjs-form-data";

@Module({
  imports: [
    NestjsFormDataModule,
  ],
  controllers: [AppController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
