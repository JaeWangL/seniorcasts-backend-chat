import { registerAs } from '@nestjs/config';
import ms from 'ms';

export default registerAs(
  'app',
  (): Record<string, any> => ({
    name: process.env.APP_NAME || 'seniorcasts-chat',
    env: process.env.APP_ENV || 'development',
    language: process.env.APP_LANGUAGE || 'ko',
    timezone: process.env.APP_TZ || 'Asia/Seoul',

    http: {
      host: process.env.APP_HOST || '0.0.0.0',
      port: process.env.APP_PORT
        ? Number.parseInt(process.env.APP_PORT, 10)
        : 8080,
    },
    globalPrefix: '/api',
    versioning: {
      on: process.env.APP_VERSIONING === 'true' || false,
      prefix: 'v',
    },
    debug: process.env.APP_DEBUG === 'true' || false,
    logging: {
      http: {
        maxFiles: 5,
        maxSize: '2M',
      },
      system: {
        active: false,
        maxFiles: ms('7d'),
        maxSize: '2m',
      },
    },

    httpOn: process.env.APP_HTTP_ON === 'true',
    taskOn: process.env.APP_TASK_ON === 'true' || false,
    microserviceOn: process.env.APP_MICROSERVICE_ON === 'true',
  })
);
