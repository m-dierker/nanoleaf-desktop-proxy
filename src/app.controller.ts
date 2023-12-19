import { Body, Controller, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { NanoleafService } from './nanoleaf.service';

interface SetSceneRequest {
  scene: string;
}

@Controller()
export class AppController {
  constructor(private readonly nanoleaf: NanoleafService) {}

  @Post('/scene')
  async setScene(
    @Body() req: SetSceneRequest,
    @Res() res: Response,
  ): Promise<string> {
    if (!req.scene) {
      res.status(400).send('Missing scene');
      return;
    }
    const success = await this.nanoleaf.setScene(req.scene);
    return success ? 'ok' : 'error';
  }
}
