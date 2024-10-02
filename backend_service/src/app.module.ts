import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {EventsModule} from "./events/events.module";

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, EventsModule],
})
export class AppModule {}
