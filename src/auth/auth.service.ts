import { JwtPayload } from './interface/jwtPayload.interface';
import { LoginDto } from './dto/login.dto';
import { UserService } from './../user/user.service';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import crypto from 'crypto';
import argon2 from 'argon2';
import { ConfigService } from '@nestjs/config';

export interface TokenResponse {
    access_token: string;
}

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    async validate(data: LoginDto) {
        const user = await this.userService.getUserByEmail(data.email);

        if (!user) {
            throw new HttpException('User does not exist', HttpStatus.BAD_REQUEST);
        }

        if (!(await argon2.verify(user.password, data.password))) {
            throw new HttpException('Wrong password', HttpStatus.BAD_REQUEST);
        }

        return user;
    }

    async login(user) {
        const payload: JwtPayload = {
            userId: user.id,
            username: user.username,
            role: user.role,
        };
        const refreshId = user.id + this.configService.get('JWT_SECRET');
        const salt = crypto.createSecretKey(crypto.randomBytes(16));
        const hash = crypto
            .createHmac('sha512', salt)
            .update(refreshId)
            .digest('base64');
        payload.refreshKey = salt.export();

        const token = await this.jwtService.signAsync(payload);

        return {
            access_token: token,
            refresh_token: hash,
        };
    }
}
