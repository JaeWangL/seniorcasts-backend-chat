import { Logger, VERSION_NEUTRAL, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { AppModule } from './application/app_module';
import { setupMiddlewaresAsync } from './middlewares';
import { setupSwagger } from './setup-swagger';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter()
  );
  const configService = app.get<ConfigService>(ConfigService);
  const env: string = configService.get<string>('app.env')!;
  const tz: string = configService.get<string>('app.timezone')!;
  const host: string = configService.get<string>('app.http.host')!;
  const port: number = configService.get<number>('app.http.port')!;
  const globalPrefix: string = configService.get<string>('app.globalPrefix')!;
  const versioning: boolean = configService.get<boolean>('app.versioning.on')!;
  const versioningPrefix: string = configService.get<string>(
    'app.versioning.prefix'
  )!;

  const logger = new Logger();
  process.env.TZ = tz;
  process.env.NODE_ENV = env;

  // Global
  app.setGlobalPrefix(globalPrefix);
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // Versioning
  if (versioning) {
    app.enableVersioning({
      type: VersioningType.URI,
      defaultVersion: VERSION_NEUTRAL,
      prefix: versioningPrefix,
    });
  }

  // Set middlewares
  await setupMiddlewaresAsync(app);
  setupSwagger(app);

  // Listen
  await app.listen(port, host);

  logger.log(`==========================================================`);
  logger.log(`App Environment is ${env}`, 'NestApplication');
  logger.log(
    `App Language is ${configService.get<string>('app.language')!}`,
    'NestApplication'
  );
  logger.log(
    `App Debug is ${configService.get<boolean>('app.debug')!.toString()}`,
    'NestApplication'
  );
  logger.log(`App Versioning is ${versioning.toString()}`, 'NestApplication');
  logger.log(
    `App Http is ${configService.get<boolean>('app.httpOn')!.toString()}`,
    'NestApplication'
  );
  logger.log(
    `App Task is ${configService.get<boolean>('app.taskOn')!.toString()}`,
    'NestApplication'
  );
  logger.log(`App Timezone is ${tz}`, 'NestApplication');

  logger.log(`==========================================================`);

  logger.log(`Server running on ${await app.getUrl()}`, 'NestApplication');

  logger.log(`==========================================================`);
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap();
