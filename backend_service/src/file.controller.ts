import {Controller, Get, Header, Req, Res, Query, StreamableFile} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('file')
export class FileController {
  @Get('download')
  getFile(@Query('target') target:string, @Query('type') type:string, @Res({ passthrough: true }) res: Response): StreamableFile {
    console.log(target);
    console.log(type);
    console.log(process.cwd());
    const file = createReadStream(join(process.cwd() + '/backend_service/public/output', 'output_' + type + '_' + target));
    res.set( 'Content-Type','text/plain');
    res.set('Content-Disposition', 'attachment; filename="'+ target +'"');

    return new StreamableFile(file);
  }
}