import type { OnGatewayDisconnect } from '@nestjs/websockets';
import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ulid } from 'ulidx';
import { ChatPublishMessages, ChatSubscribeMessages } from './chat_interfaces';
import type { NewMessageMessage } from './messages/publish_messages';
import { SendMessageMessage } from './messages/subscribe_messages';

@WebSocketGateway({
  transports: ['websocket'],
  path: '/chat-session/',
  cors: {
    origin: '*',
  },
})
export class ChatGateway implements OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  handleDisconnect(client: Socket): void {
    this.disconnectClient(client);
  }

  @SubscribeMessage(ChatSubscribeMessages.SEND_MESSAGE)
  handleSendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: SendMessageMessage
  ): void {
    const { roomId, message } = data;
    /*
    const user = await this.authSvc.verifyTokenAsync(
      client.handshake.headers.authorization!.split(' ')[1]
    );
    */

    // publish to all users in 자신을 포함한 roomId
    this.server.in(roomId).emit(ChatPublishMessages.NEW_MESSAGE, {
      id: ulid(),
      message,
      createdAt: new Date(),
    } as NewMessageMessage);
  }

  private disconnectClient(client: Socket): void {
    client.disconnect(true);
  }
}
