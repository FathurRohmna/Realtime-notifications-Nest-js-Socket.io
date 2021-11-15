import { PostGateway } from './post.gateway';
import { CreateCategoryDto } from './../category/dto/createCategory.dto';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CategoryService } from './../category/category.service';
import { CreatePostDto } from './dto/createPost.dto';
import { PostRepository } from './post.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
    constructor(
        private readonly repository: PostRepository,
        private readonly categoryService: CategoryService,
        private readonly postGateway: PostGateway,
    ) {}

    async getPosts() {
        return this.repository.findMany({
            include: {
                categories: true,
            },
        });
    }

    async getPostById(id: string) {
        const post = await this.repository.findUnique({
            where: {
                id: id,
            },
        });

        return post;
    }

    async createPost(postData: CreatePostDto) {
        return await this.repository.create({
            data: postData,
        });
    }

    async updatePost(id: string, postData: UpdatePostDto) {
        return await this.repository.update({
            where: {
                id,
            },
            data: postData,
        });
    }

    async updatePostWithCreateCategory(id: string, categoryData: CreateCategoryDto) {
        return await this.repository.update({
            where: {
                id,
            },
            data: {
                categories: {
                    create: {
                        name: categoryData.name,
                    },
                },
            },
        });
    }

    async createPostAndCategory(post: CreatePostDto) {
        const newPost = await this.repository.create({
            data: {
                title: post.title,
                content: post.content,
            },
        });
        const categories = post?.categories;

        if (categories) {
            categories.map(async (category: string) => {
                const checkexistingCategory = await this.categoryService.getCategoryByName(
                    category,
                );

                if (checkexistingCategory) {
                    const updateDto = {
                        posts: newPost.id,
                    };
                    return await this.categoryService.updateCategory(
                        checkexistingCategory.id,
                        updateDto,
                    );
                } else {
                    const dataDto = {
                        name: category,
                    };
                    return await this.updatePostWithCreateCategory(newPost.id, dataDto);
                }
            });
        } else {
            return newPost;
        }

        this.postGateway.wss.emit('postArticle', `${newPost.title}`);

        return newPost;
    }

    async updatePostCategory(id: string, postUpdate: UpdatePostDto) {
        const categories = postUpdate?.categories;

        if (categories) {
            categories.map(async (category: string) => {
                const checkexistingCategory = await this.categoryService.getCategoryByName(
                    category,
                );

                if (checkexistingCategory) {
                    const updateDto = {
                        posts: id,
                    };
                    return await this.categoryService.updateCategory(
                        checkexistingCategory.id,
                        updateDto,
                    );
                } else {
                    const dataDto = {
                        name: category,
                    };
                    return await this.updatePostWithCreateCategory(id, dataDto);
                }
            });
        }
    }

    async deletePostById(id: string) {
        return this.repository.delete({
            where: {
                id,
            },
        });
    }
}
