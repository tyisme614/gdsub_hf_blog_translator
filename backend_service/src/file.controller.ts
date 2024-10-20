import {Controller, Get, Header, Req, Res, Query, StreamableFile} from '@nestjs/common';
import { createReadStream, existsSync } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('file')
export class FileController {
  @Get('download')
  getFile(@Query('target') target:string, @Query('type') type:string, @Res({ passthrough: true }) res: Response): StreamableFile {
    let res_data = null;
    let target_path = join(process.cwd() + '/public/output', 'output_' + type + '_' + target);
    if (existsSync(target_path)) {

      res.set( 'Content-Type','text/plain');
      res.set('Content-Disposition', 'attachment; filename="'+ type + '_' + target +'"');
      res_data = new StreamableFile(createReadStream(target_path));
    }else{

      res.set( 'Content-Type','text/html');
      res_data = new StreamableFile(createReadStream(join(process.cwd() + '/views', '404.html')));
    }



    return res_data;
  }
}