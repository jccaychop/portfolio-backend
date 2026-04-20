import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login-user.dto';
import { UsersService } from '@/users/users.service';
import { User } from '@/users/entities/user.entity';

export interface JwtPayload {
  id: string;
  roles: string[];
}

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findOneByEmail(email);

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are not valid (Password)');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }

    const payload: JwtPayload = { id: user.id, roles: user.roles };
    const token = this.getJwtToken(payload);

    return {
      user,
      token,
    };
  }

  checkAuthStatus(user: User) {
    const payload: JwtPayload = { id: user.id, roles: user.roles };
    const token = this.getJwtToken(payload);

    return {
      user,
      token,
    };
  }

  private getJwtToken(payload: JwtPayload) {
    return this.jwtService.sign(payload);
  }
}
