import { Body, Controller, Get, Post } from '@nestjs/common';
import { LoginDto } from './dto/login-user.dto';
import { AuthService } from './auth.service';
import { Auth, GetUser } from './decorators';
import { User } from '@/users/entities/user.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Auth()
  @Get('check-status')
  checkStatus(@GetUser() user: User) {
    return this.authService.checkAuthStatus(user);
  }
}
