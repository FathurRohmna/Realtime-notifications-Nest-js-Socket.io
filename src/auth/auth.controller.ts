import { LoginDto } from './dto/login.dto';
import { JwtPayloadResponse } from './interface/jwtPayload.interface';
import { UserService } from './../user/user.service';
import { ValidationPipe } from './pipes/validation.pipe';
import { CreateUserDto } from './../user/dto/createUser.dto';
import { AuthService } from './auth.service';
import {
    Controller,
    Post,
    Body,
    UseInterceptors,
    ClassSerializerInterceptor,
    HttpException,
    HttpStatus,
} from '@nestjs/common';
import {
    ApiTags,
    ApiBadRequestResponse,
    ApiOkResponse,
    ApiProduces,
    ApiUnauthorizedResponse,
    ApiCreatedResponse,
} from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
    constructor(
        private readonly authService: AuthService,
        private readonly userService: UserService,
    ) {}

    @Post('/signup')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBadRequestResponse({
        description: 'make sure all field are filled and valid',
    })
    @ApiCreatedResponse({
        description: 'User Successfully created',
    })
    @ApiOkResponse({
        description: 'access token and User Data',
        type: JwtPayloadResponse,
    })
    async signup(@Body(new ValidationPipe()) createUserDto: CreateUserDto) {
        const existingEmail = await this.userService.getUserByEmail(
            createUserDto.email,
        );
        if (existingEmail) {
            throw new HttpException(
                'User with that email already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const existingUsername = await this.userService.getUserByUsername(
            createUserDto.username,
        );
        if (existingUsername) {
            throw new HttpException(
                'User with that username already exists',
                HttpStatus.BAD_REQUEST,
            );
        }

        const newUser = await this.userService.createUser(createUserDto);
        const token = await this.authService.login(newUser);

        return token;
    }

    @Post('/signin')
    @UseInterceptors(ClassSerializerInterceptor)
    @ApiBadRequestResponse({
        description: 'username | password could not be null',
    })
    @ApiUnauthorizedResponse({ description: 'Authentication Failed' })
    @ApiOkResponse({
        description: 'access token and User Data',
        type: JwtPayloadResponse,
    })
    @ApiProduces('application/json')
    async signin(@Body(new ValidationPipe()) loginDto: LoginDto) {
        const validUser = await this.authService.validate(loginDto);
        const token = await this.authService.login(validUser);

        return token;
    }
}
