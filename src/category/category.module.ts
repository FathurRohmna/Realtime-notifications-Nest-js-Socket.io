import { PrismaModule } from './../prisma/prisma.module';
import { CategoryRepository } from './category.repository';
import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';

@Module({
    imports: [PrismaModule],
    providers: [CategoryService, CategoryRepository],
    exports: [CategoryService],
    controllers: [CategoryController],
})
export class CategoryModule {}
