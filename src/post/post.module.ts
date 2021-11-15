import { PostGateway } from './post.gateway';
import { PrismaModule } from './../prisma/prisma.module';
import { PostRepository } from './post.repository';
import { CategoryModule } from './../category/category.module';
import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
    imports: [CategoryModule, PrismaModule],
    providers: [PostService, PostRepository, PostGateway],
    controllers: [PostController],
})
export class PostModule {}
