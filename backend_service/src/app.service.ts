import { Injectable } from '@nestjs/common';
import * as openai_worker from './../../openai_worker';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  commitTask(url):string{
    openai_worker.download_source_file(url);
    let res = {
      code: 200,
      err: ''
    }

    return JSON.stringify(res);
  }
}
