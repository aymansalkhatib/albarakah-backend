import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AppJwtService } from '../../shared/modules/app-jwt/app-jwt.service';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';
import { SystemUser } from '../system-users/entities/system-user.entity';
import { AccessTokenPayload } from '../../shared/modules/app-jwt/interfaces';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: AppJwtService,
    @InjectRepository(SystemUser)
    private readonly systemUserRepository: Repository<SystemUser>,
  ) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const { username, password } = loginDto;

    // Find user by username with relations
    const systemUser = await this.systemUserRepository.findOne({
      where: { username },
      relations: ['employee', 'employee.person'],
    });

    if (!systemUser) {
      throw new UnauthorizedException('Invalid username or password');
    }

    // Verify password (assuming password is hashed with bcrypt)
    const isPasswordValid = await bcrypt.compare(password, systemUser.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid username or password');
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
