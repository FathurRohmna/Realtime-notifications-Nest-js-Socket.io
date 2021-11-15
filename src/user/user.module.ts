import { PrismaModule } from './../prisma/prisma.module';
import { UserRepository } from './user.repository';
import { Module } from '@nestjs/common';
import { UserService } from './user.service';

@Module({
    imports: [PrismaModule],
    providers: [UserService, UserRepository],
    exports: [UserService],
})
export class UserModule {}
