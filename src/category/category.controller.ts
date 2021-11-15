import { ValidationPipe } from './../auth/pipes/validation.pipe';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryInterface } from './interface/categoryInterface';
import { CategoryService } from './category.service';
import {
    Controller,
    Post,
    Body,
    Get,
    Delete,
    Param,
    UseInterceptors,
    ClassSerializerInterceptor,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBearerAuth,
    ApiOkResponse,
    ApiResponse,
    ApiCreatedResponse,
    ApiBadRequestResponse,
} from '@nestjs/swagger';

@ApiTags('Category')
@Controller('category')
export class CategoryController {
    constructor(private readonly categoryService: CategoryService) {}

    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        isArray: true,
        type: CategoryInterface,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAllCategories() {
        return await this.categoryService.getAllCategories();
    }

    @Post()
    @ApiBadRequestResponse({
        description: 'make sure all field are filled and valid',
    })
    @ApiCreatedResponse({
        description: 'Category Successfully created',
    })
    @ApiOkResponse({
        description: 'New Category Data',
        type: CategoryInterface,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async createCategory(@Body(new ValidationPipe()) data: CreateCategoryDto) {
        return await this.categoryService.createCategory(data);
    }

    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Get all categires',
        type: CategoryInterface,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    @Get(':name')
    async getCategoryByName(@Param('name') name: string) {
        return await this.categoryService.getCategoryByName(name);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Categoty was deleted',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async deleteCategory(@Param('id') id: string) {
        return await this.categoryService.deleteCategoryById(id);
    }
}
