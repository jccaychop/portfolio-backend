import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from '../auth.service';
import { UsersService } from '@/users/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    super({
      secretOrKey: configService.get<string>('jwtSecret')!,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }

  // This method is ONLY executed if the token is valid, its signature is correct, and it has not expired.
  async validate(payload: JwtPayload) {
    const { id } = payload;

    try {
      const user = await this.usersService.findOne(id);

      if (!user.isActive) {
        throw new UnauthorizedException('User is inactive, talk with an admin');
      }

      // it is injected into the 'Request' object (req.user)
      return user;
    } catch {
      throw new UnauthorizedException('Token not valid');
    }
  }
}
