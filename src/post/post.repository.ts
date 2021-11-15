/* eslint-disable prettier/prettier */
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostRepository {
    constructor(private readonly prisma: PrismaService) {}

    findUnique = this.prisma.post.findUnique;
    findMany = this.prisma.post.findMany;
    create = this.prisma.post.create;
    update = this.prisma.post.update;
    upsert = this.prisma.post.upsert;
    delete = this.prisma.post.delete;
}
