import { MessageModule } from '@i18n/i18n_module';
import { AllConfigs } from '@infrastructure/config';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { WebsocketModule } from './websocket/websocket_module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    // Infrastrcuture
    ConfigModule.forRoot({
      load: AllConfigs,
      ignoreEnvFile: false,
      isGlobal: true,
      cache: true,
      envFilePath: ['.env'],
    }),

    // I18n
    MessageModule,

    // Shared

    // Application
    WebsocketModule,
  ],
})
export class AppModule {}
