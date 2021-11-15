import { UserRepository } from './../user/user.repository';
import { mockedJwtService } from './../utils/mocks/jwt.service';
import { JwtService } from '@nestjs/jwt';
import { mockedConfigService } from './../utils/mocks/config.service';
import { ConfigService } from '@nestjs/config';
import { UserService } from './../user/user.service';
import { Test, TestingModule } from '@nestjs/testing';
import argon2 from 'argon2';
import { AuthService } from './auth.service';

describe('AuthService', () => {
    let service: AuthService;
    let userService: UserService;
    let argonVerify: Jest.Mock;
    let userData: any;
    let findUser: jest.Mock;

    const mockedUser = {
        id: 'uyayudasd3',
        email: 'fr081@gmail.com',
        username: 'ftr',
        fullName: 'Fathur Rohman',
        password: 'strongpassword',
    };

    beforeEach(async () => {
        userData = {
            ...mockedUser,
        };
        findUser = jest.fn().mockResolvedValue(userData);
        const usersRepository = {
            findUnique: findUser,
        };

        argonVerify = jest.fn().mockReturnValue(true);
        (argon2.verify as jest.Mock) = argonVerify;

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                UserService,
                {
                    provide: ConfigService,
                    useValue: mockedConfigService,
                },
                {
                    provide: JwtService,
                    useValue: mockedJwtService,
                },
                {
                    provide: UserRepository,
                    useValue: usersRepository,
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        userService = module.get<UserService>(UserService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('when accessing the data of authenticating user / Validate', () => {
        it('should attempt to get a user by email', async () => {
            const getUserByEmailSpy = jest.spyOn(userService, 'getUserByEmail');
            await service.validate({
                email: 'fr081@gmail.com',
                password: 'strongpassword',
            });
            expect(getUserByEmailSpy).toBeCalledTimes(1);
        });
        describe('and the user is not found in the database', () => {
            beforeEach(() => {
                findUser.mockResolvedValue(undefined);
            });
            it('should throw an error', async () => {
                await expect(
                    service.validate({
                        email: 'fr081@gmail.com',
                        password: 'strongpassword',
                    }),
                ).rejects.toThrow();
            });
        });
        describe('and the provided password is not valid', () => {
            beforeEach(() => {
                argonVerify.mockReturnValue(false);
            });
            it('should throw an error', async () => {
                await expect(
                    service.validate({
                        email: 'fr081@gmail.com',
                        password: 'strongpassword',
                    }),
                ).rejects.toThrow();
            });
        });
        describe('and provided password is valid', () => {
            beforeEach(() => {
                argonVerify.mockReturnValue(true);
            });
            describe('and the provided password is valid', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(userData);
                });
                it('should return the user data', async () => {
                    const user = await service.validate({
                        email: 'fr081@gmail.com',
                        password: 'strongpassword',
                    });
                    expect(user).toBe(userData);
                });
            });
            describe('and the user is not found in the database', () => {
                beforeEach(() => {
                    findUser.mockResolvedValue(undefined);
                });
                it('should throw an error', async () => {
                    await expect(
                        service.validate({
                            email: 'fr081@gmail.com',
                            password: 'strongpassword',
                        }),
                    ).rejects.toThrow();
                });
            });
        });
    });
});
