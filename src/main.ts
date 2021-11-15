import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

import { AppModule } from './app.module';

async function bootstrap() {
    const logger = new Logger('boostrapp');
    const app = await NestFactory.create<NestExpressApplication>(AppModule);
    app.setGlobalPrefix('v1/api');
    app.enableCors({
        origin: '*',
        methods: 'GET,POST,DELETE,UPDATE',
        allowedHeaders: 'Origin, X-Requested-With,Content-Type,Accept',
        credentials: true,
    });

    const options = new DocumentBuilder()
        .setTitle('Articles Socketio Documenttation')
        .addBearerAuth()
        .setDescription(
            'This API has beenn created to help developpers to prototypate theirs apps easily',
        )
        .setVersion('1.0')
        .build();

    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('/docs/v1', app, document);

    await app.listen(5000).then(() => {
        logger.log('listenning on port :' + 5000);
    });
}
bootstrap();
