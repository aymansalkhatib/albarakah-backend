import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { SystemUser } from '../../../modules/system-users/entities/system-user.entity';
import { TranslateHelper } from '../../../shared/modules/app-i18n/translate.helper';
import { AppJwtService } from '../../../shared/modules/app-jwt/app-jwt.service';
import { AccessTokenPayload } from '../../../shared/modules/app-jwt/interfaces';
import { LoginDto } from '../dtos/requests/login.dto';
import { LoginResponseDto } from '../dtos/responses/login-response.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: AppJwtService,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
    private readonly t: TranslateHelper,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // Find user by username with relations
    const systemUser = await this.systemUserRepository.findOne({
      where: { username },
      relations: ['employee', 'employee.person'],
    });

    if (!systemUser) {
      throw new UnauthorizedException(
        this.t.tr('auth.errors.invalid_credentials'),
      );
    }

    // Verify password (assuming password is hashed with bcrypt)
    const isPasswordValid = await bcrypt.compare(password, systemUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        this.t.tr('auth.errors.invalid_credentials'),
      );
    }

    // Update last login
    await this.systemUserRepository.update(systemUser.id, {
      lastLogin: new Date(),
    });

    // Create JWT payload
    const payload: AccessTokenPayload = {
      userId: systemUser.id,
      username: systemUser.username,
    };

    // Generate access token
    const accessToken = this.jwtService.createAccessToken(payload);

    return {
      accessToken,
      user: systemUser,
    };
  }
}
