import {Controller, Get, Header, Req, Res, StreamableFile} from '@nestjs/common';
import { createReadStream } from 'fs';
import { join } from 'path';
import type { Response } from 'express';

@Controller('file')
export class FileController {
  @Get('download')
  @Header('Content-Type', 'application/json')
  @Header('Content-Disposition', 'attachment; filename="package.json"')
  getFile(@Req() req: Request, @Res({ passthrough: true }) res: Response): StreamableFile {
    console.log(req.params['target']);
    const file = createReadStream(join(process.cwd(), 'package.json'));
    res.set( 'Content-Type','text/plain');
    res.set('Content-Disposition', 'attachment; filename="package.json"');

    return new StreamableFile(file);
  }
}