import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  async getHello() {
    try {
    } catch (e) {
      return e.toString();
    }

    return this.appService.getHello();
  }
}
