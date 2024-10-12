import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { extname } from 'path';
import { promises as fs } from 'fs';

import { ChatsService } from './chats.service';
import { CreateMessageDto } from './dto/createMessage.dto';

@WebSocketGateway({ cors: true })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatsService: ChatsService) {}

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('joinChat')
  handleJoinChat(
    @ConnectedSocket() client: Socket,
    @MessageBody() chatId: number,
  ) {
    client.join(chatId.toString());
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() payload: CreateMessageDto,
  ) {
    const message = await this.chatsService.saveMessage(payload);

    this.server.to(payload.chatId.toString()).emit('message', message);
  }

  @SubscribeMessage('sendImage')
  async handleImage(
    client: Socket,
    payload: {
      chatId: number;
      userId: number;
      image: string;
      fileName: string;
    },
  ) {
    const fileExtension = extname(payload.fileName);
    const fileName = `${Date.now()}${fileExtension.replaceAll(' ', '')}`;
    const filePath = `./uploads/message-img/${fileName}`;

    const buffer = Buffer.from(payload.image, 'base64');

    await fs.writeFile(filePath, buffer);

    const message = await this.chatsService.createImageMessage(
      payload.chatId,
      payload.userId,
      `http://localhost:8080/uploads/message-img/${fileName}`,
    );

    this.server.to(payload.chatId.toString()).emit('message', message);
  }
}
