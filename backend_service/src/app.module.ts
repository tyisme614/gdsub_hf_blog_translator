import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {EventsGateway} from "./events/events.gateway";
import {NestjsFormDataModule} from "nestjs-form-data";
import {FileController} from "./file.controller";

@Module({
  imports: [
    NestjsFormDataModule,
  ],
  controllers: [AppController, FileController],
  providers: [AppService, EventsGateway],
})
export class AppModule {}
