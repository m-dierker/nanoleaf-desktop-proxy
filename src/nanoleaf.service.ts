import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const NANOLEAF_PORT = 15765;

@Injectable()
export class NanoleafService {
  constructor(
    private readonly http: HttpService,
    private readonly config: ConfigService,
  ) {}

  async setScene(sceneName: string): Promise<boolean> {
    console.log('Setting scene', sceneName);
    const body = {
      devices: [
        {
          id: this.config.get('LIGHTS_ID'),
          ip: this.config.get('LIGHTS_IP'),
          isEssentials: true,
          model: this.config.get('LIGHTS_MODEL'),
          port: +this.config.get('LIGHTS_PORT'),
        },
      ],
      value: { effect: { value: sceneName } },
    };

    const resp = await this.http.axiosRef.post(
      `http://127.0.0.1:${NANOLEAF_PORT}/essentials/control`,
      body,
    );

    return resp.status === 200;
  }
}
