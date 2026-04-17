import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '@/users/users.service';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('Seed');

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const adminEmail = this.configService.get<string>('seed.adminEmail')!;
    const adminPassword = this.configService.get<string>('seed.adminPassword')!;

    const user = await this.usersService.findOneByEmailSilent(adminEmail);

    if (!user) {
      await this.usersService.createAdmin({
        email: adminEmail,
        password: adminPassword,
        fullName: 'System Administrator',
      });
      return;
    }

    if (!user.isActive || user.deletedAt !== null) {
      this.logger.log(`Restoring administrator access: ${adminEmail}`);

      await this.usersService.restoreAdmin(user.id);
    }
  }
}
