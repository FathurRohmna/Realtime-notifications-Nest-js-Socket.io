/* eslint-disable prettier/prettier */
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    WebSocketServer,
    OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({ namespace: 'post', cors: true  })
export class PostGateway implements OnGatewayConnection, OnGatewayDisconnect {
    logger = new Logger('PostGateway');

    @WebSocketServer()
    wss: Server;

    handleConnection(socket: Socket, ...args: any[]) {
      this.logger.warn('Connection success!');
    }

    handleDisconnect(socket: Socket) {
      this.logger.warn('user disconnected');
    }

    @SubscribeMessage('postArticle')
    handlePosts(payload: string): string {
        this.logger.log(payload);
        return payload;
    }
}
