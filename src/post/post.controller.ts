import { PostInterface } from './interface/postInterface';
import { UpdatePostDto } from './dto/updatePost.dto';
import { CreatePostDto } from './dto/createPost.dto';
import { ValidationPipe } from './../auth/pipes/validation.pipe';
import { PostService } from './post.service';
import {
    Controller,
    Post,
    Body,
    Get,
    Put,
    Delete,
    UseInterceptors,
    ClassSerializerInterceptor,
    Param,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiResponse,
    ApiCreatedResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Post')
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    @ApiBadRequestResponse({
        description: 'make sure all field are filled and valid',
    })
    @ApiCreatedResponse({
        description: 'Post Successfully created',
    })
    @ApiOkResponse({
        description: 'New Post Data',
        type: PostInterface,
    })
    @UseInterceptors(ClassSerializerInterceptor)
    async postArticle(@Body(new ValidationPipe()) createPost: CreatePostDto) {
        return await this.postService.createPostAndCategory(createPost);
    }

    @Get()
    @ApiBearerAuth()
    @ApiOkResponse({
        isArray: true,
        type: PostInterface,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getAllPosts() {
        return await this.postService.getPosts();
    }

    @Get(':id')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Get post data by Id',
        type: PostInterface,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async getPostById(@Param('id') id: string) {
        return await this.postService.getPostById(id);
    }

    @Put(':id')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Edit post',
        type: PostInterface,
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async updatePost(
        @Param('id') id: string,
        @Body(new ValidationPipe()) updatePost: UpdatePostDto,
    ) {
        return await this.postService.updatePostCategory(id, updatePost);
    }

    @Delete(':id')
    @ApiBearerAuth()
    @ApiOkResponse({
        description: 'Post was deleted',
    })
    @ApiResponse({
        status: 401,
        description: 'Unauthorized',
    })
    async deletePost(@Param('id') id: string) {
        return await this.postService.deletePostById(id);
    }
}
