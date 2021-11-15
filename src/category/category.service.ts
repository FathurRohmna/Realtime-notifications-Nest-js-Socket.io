import { UpdateCategoryDto } from './dto/updateCategory.dto';
import { CreateCategoryDto } from './dto/createCategory.dto';
import { CategoryRepository } from './category.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CategoryService {
    constructor(private readonly repository: CategoryRepository) {}

    async getAllCategories() {
        return await this.repository.findMany();
    }

    async getCategoryByName(name: string) {
        const category = await this.repository.findUnique({
            where: {
                name: name,
            },
            include: {
                posts: true,
            },
        });

        return category;
    }

    async createCategory(category: CreateCategoryDto) {
        return await this.repository.create({
            data: category,
        });
    }

    async updateCategory(id: string, categoryData: UpdateCategoryDto) {
        return await this.repository.update({
            where: {
                id,
            },
            data: {
                posts: {
                    connect: [{ id: categoryData.posts }],
                },
            },
            select: {
                posts: true,
            },
        });
    }

    async deleteCategoryById(id: string) {
        return this.repository.delete({
            where: {
                id,
            },
        });
    }
}
