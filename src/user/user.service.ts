import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/createUser.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
    constructor(private readonly repository: UserRepository) {}

    async getUserByEmail(email: string) {
        const user = await this.repository.findUnique({
            where: {
                email,
            },
        });

        return user;
    }

    async getUserById(userId: string) {
        const user = await this.repository.findUnique({
            where: {
                id: userId,
            },
        });

        return user;
    }

    async getUserByUsername(username: string) {
        const user = await this.repository.findUnique({
            where: {
                username,
            },
        });

        return user;
    }

    createUser(user: CreateUserDto) {
        return this.repository.create({
            data: user,
        });
    }
}
