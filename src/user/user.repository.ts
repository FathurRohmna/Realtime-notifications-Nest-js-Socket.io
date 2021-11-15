/* eslint-disable prettier/prettier */
import { PrismaService } from './../prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}

  findUnique = this.prisma.user.findUnique;
  create = this.prisma.user.create;
}
