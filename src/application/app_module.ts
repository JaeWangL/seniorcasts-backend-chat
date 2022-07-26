import { MessageModule } from '@i18n/i18n_module';
import { Module } from '@nestjs/common';
import { WebsocketModule } from './websocket/websocket_module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    // I18n
    MessageModule,

    // Shared

    // Application
    WebsocketModule,
  ],
})
export class AppModule {}
