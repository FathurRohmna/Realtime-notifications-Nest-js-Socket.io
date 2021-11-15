/* eslint-disable prettier/prettier */
import { UserService } from './../user/user.service';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { Test, TestingModule } from '@nestjs/testing';

describe('AuthController', () => {
    let controller: AuthController;
    let userService: UserService;

    const mockedUser = {
        id: 'uyayudasd3',
        email: 'fr081@gmail.com',
        username: 'ftr',
        fullName: 'Fathur Rohman',
        password: 'strongpassword',
        role: 'USER',
    };

    const mockUserService = {
        getUserByEmail: jest.fn(email => {
            return {
                ...mockedUser,
                email: email,
            };
        }),
        getUserByUsername: jest.fn(username => {
            return {
                ...mockedUser,
                username: username,
            };
        }),
        createUser: jest.fn(dto => {
            return {
                id: 'hjasjd7327asdhjasd',
                role: 'USER',
                ...dto,
            };
        }),
    };

    const token = {
        access_token: 'randomToken',
        refreshToken: 'refreshToken',
    };

    const authServiceMock = {
        validate: jest.fn().mockResolvedValue(mockedUser),
        login: jest.fn().mockResolvedValue(token),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                { provide: AuthService, useValue: authServiceMock },
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        controller = module.get<AuthController>(AuthController);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    describe('Signup, when accessing the data', () => {
        it('should throw an error the user with that email/username already exists', async () => {
            await expect(
                controller.signup({
                    username: 'ftr',
                    email: 'fr081938@gmail.com',
                    password: 'strongpassword',
                    fullName: 'Fathur Rohman',
                })
            ).rejects.toThrow();
        })
        describe('and provided email and password is valid', () => {
            beforeEach(() => {
                userService.getUserByEmail.mockReturnValue(undefined);
                userService.getUserByUsername.mockReturnValue(undefined);
            })
            const dto = {
                username: 'ftr',
                email: 'fr081938@gmail.com',
                password: 'strongpassword',
                fullName: 'Fathur Rohman',
            };

            it('should return the new User', async () => {
                const newUser = await userService.createUser(dto)
                expect(newUser).toEqual({
                    id: 'hjasjd7327asdhjasd',
                    role: 'USER',
                    ...dto
                })
            })

            it('should return the access_token', async () => {
                const getToken = await controller.signup({
                        username: 'ftr',
                        email: 'fr081938@gmail.com',
                        password: 'strongpassword',
                        fullName: 'Fathur Rohman',
                    })
                expect(getToken).toEqual(token)
            }) 
        })
    });

    it('Signin, it should be return a accesstoken', async () => {
        const getToken = await controller.signin({
            email: 'fr081938@gmail.com',
            password: 'strongpassword',
        })
        expect(getToken).toEqual(token)
    }) 
    
});
