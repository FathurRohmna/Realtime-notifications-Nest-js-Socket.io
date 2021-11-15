/* eslint-disable prettier/prettier */
import { IsString, IsOptional } from 'class-validator';

export class UpdateCategoryDto {
    @IsString()
    @IsOptional()
    name?: string;

    @IsOptional()
    posts?: string;
}
