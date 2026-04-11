import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvConfiguration, JoiValidationSchema } from '@/config';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [EnvConfiguration],
      validationSchema: JoiValidationSchema,
    }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ssl: configService.get<string>('stage') === 'prod',
        type: 'postgres',
        host: configService.get<string>('dbHost'),
        port: configService.get<number>('dbPort'),
        username: configService.get<string>('dbUsername'),
        password: configService.get<string>('dbPassword'),
        database: configService.get<string>('dbName'),
        autoLoadEntities: true,
        synchronize: configService.get<string>('environment') === 'dev',
      }),
    }),
    UsersModule,
    ProjectsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
