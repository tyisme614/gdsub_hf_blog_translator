import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from '@nestjs/websockets';
import { WebSocket } from 'ws';
import * as openai_worker from "./../../../openai_worker";

@WebSocketGateway(8080)
export class EventsGateway {
  @WebSocketServer()
  server: WebSocket.Server;

  @SubscribeMessage('events')
  handleEvent( @ConnectedSocket() client: any, data: string): string {
    let json = JSON.parse(data);
    if(json.type === 'register'){
      openai_worker.register_client(client, json.file);
    }
    return data;
  }
}