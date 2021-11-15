/* eslint-disable prettier/prettier */
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryRepository {
    constructor(private readonly prisma: PrismaService) {}

    findMany = this.prisma.category.findMany;
    findUnique = this.prisma.category.findUnique;
    create = this.prisma.category.create;
    delete = this.prisma.category.delete;
    update = this.prisma.category.update;
}
