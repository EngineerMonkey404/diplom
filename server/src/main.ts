import { AppModule } from './app.module';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import * as bodyParser from 'body-parser';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  console.log(join(__dirname, '..', 'public'));
  const cs = app.get<ConfigService>(ConfigService);
  // as = app.get<AuthService>(AuthService);

  app.setGlobalPrefix('api');
  app.use(bodyParser.json({ limit: '50mb' }));
  app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

  const config = new DocumentBuilder()
    .setTitle('diplom')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(cs.get('SWAGGER_PREFIX'), app, document);

  const { httpAdapter } = app.get(HttpAdapterHost);

  const host = cs.get('BACKEND_HOST');
  const port = cs.get('PORT');
  app.enableCors({
    origin: ['http://localhost:3000'],
    credentials: true,
  });
  // app.use(cookieParser(as.secretKey));
  app.use(
    '/public',
    express.static(join(__dirname, '..', '/src/storage/models3d')),
  );
  app.listen(cs.get('PORT'));
}
bootstrap();
