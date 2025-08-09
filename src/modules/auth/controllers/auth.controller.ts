import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { LoginDto } from '../dtos/requests/login.dto';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';
import { AuthService } from '../services/auth.service';
import { SerializeResponse } from '@app/common/decorators/serialize-response.decorator';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @SerializeResponse(LoginResponseDto)
  async login(@Body() loginDto: LoginDto): Promise<LoginResponseDto> {
    return await this.authService.login(loginDto);
  }
}
