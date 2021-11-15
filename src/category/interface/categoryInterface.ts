/* eslint-disable prettier/prettier */
import { PostController } from './../../post/post.controller';
import { ApiProperty } from '@nestjs/swagger';

export class CategoryInterface {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    posts: PostController[];
}
