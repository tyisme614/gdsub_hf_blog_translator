import {Controller, Get, Post, Body, Render} from '@nestjs/common';
import {FormDataRequest} from "nestjs-form-data";
import { AppService } from './app.service';
import {TaskDto} from "./task.dto";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Render('index')
  root() {
    return {message: 'Hello yuan!'};
  }
  // @Get()
  // getHello(): string {
  //   return this.appService.getHello();
  // }

  @Post('commitTask')
  @FormDataRequest()
  commitTask(@Body() body: TaskDto):string {
    return this.appService.commitTask(body.url);
  }

}
