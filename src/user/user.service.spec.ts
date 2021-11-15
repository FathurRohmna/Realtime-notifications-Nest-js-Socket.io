import { DummyRepository } from './../prisma/testing/dummy.repository';
import { UserRepository } from './user.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { createSpyObj } from 'jest-createspyobj';

import { UserService } from './user.service';

describe('UserService', () => {
    let service: UserService;
    let repository: jest.Mocked<UserRepository>;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository,
                    useValue: createSpyObj(
                        class UserRepository extends DummyRepository {},
                    ),
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        repository = module.get(UserRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should be find user by id', async () => {
        await service.getUserById('u');
        expect(repository.findUnique).toHaveBeenCalledWith({
            where: { id: 'u' },
        });
    });

    it('should be find user by email', async () => {
        await service.getUserByEmail('fr@gmail.com');
        expect(repository.findUnique).toHaveBeenCalledWith({
            where: { email: 'fr@gmail.com' },
        });
    });

    it('should be find user by username', async () => {
        await service.getUserByUsername('ftr');
        expect(repository.findUnique).toHaveBeenCalledWith({
            where: { username: 'ftr' },
        });
    });

    it('should be create a user', async () => {
        const dto = {
            email: 'fr@gmail.com',
            username: 'ftr',
            password: 'hello1234',
        };

        await service.createUser(dto);
        expect(repository.create).toHaveBeenCalledWith({
            data: dto,
        });
    });
});
