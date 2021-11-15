/* eslint-disable prettier/prettier */
import { CategoryInterface } from './../../category/interface/categoryInterface';
import { ApiProperty } from '@nestjs/swagger';

export class PostInterface {
    @ApiProperty()
    id: string;

    @ApiProperty()
    title: string;

    @ApiProperty()
    content: string;

    @ApiProperty()
    categories?: CategoryInterface[];
}
